# To Upgrade — Security + UI/UX Backlog

Consolidated audit from a deep review on 2026-05-22. Items are
ordered by severity / impact within each section. This is a living
document — strike through or remove items as they ship.

---

## 🔒 Security findings

### P0 — Real risk, fix soon

#### 1. Code execution is effectively unsandboxed

`testRunner.ts` spawns `python3`, `node`, `javac`, `java`, `rustc`
against arbitrary user input with:

- `env: { PATH: process.env.PATH ?? '' }` (env stripped)
- `cwd: '/tmp'`
- `timeout: 5000` (5 s)
- `maxBuffer: 1024 * 1024` (1 MB stdout)

That blocks env-variable exfil and grossly long-running code, but
**does not** prevent:

- **Outbound network calls** — `fetch()`, `urllib`, `Socket`,
  `java.net.HttpURLConnection`. User code can hit Render's metadata,
  internal services, or any external endpoint. SSRF + data exfil
  vector.
- **Filesystem reads** — `/etc/passwd`, `/proc/self/maps`, the Node
  `node_modules` directory (incl. Prisma client + application code at
  request time).
- **Persistent files in `/tmp`** — across requests, attackers can
  plant binaries or `.bashrc`-style profile files that later
  subprocesses might exec.
- **Resource consumption** — no memory cap (`--max-old-space-size`),
  no CPU pinning, no fork limits. 5 s × N concurrent submissions can
  pin the API CPU.
- **Compiler abuse** — `rustc` and `javac` accept arbitrary input;
  they're full toolchains.

**Mitigation, cheapest → most rigorous**:

1. Cheapest: `--max-old-space-size=128` on `node`, `setrlimit` via a
   wrapper script, deny network with `iptables` rules at container
   start.
2. Better: deploy [judge0](https://github.com/judge0/judge0) or
   [piston](https://github.com/engineer-man/piston) as a separate
   Render service. ~$7–25/mo for a worker tier. The test runner
   becomes an HTTP call.
3. Best: gVisor / runsc + a sidecar container.

#### 2. OAuth access token leaks via URL fragment

`oauth-google.ts` / `oauth-facebook.ts` do
`reply.redirect(\`${frontendBase}/auth/oauth-complete#access=…\`)`,
putting a 15-min JWT into the URL fragment. Even though fragments
aren't sent to servers, they appear in browser history, JS via
`location.hash`, browser extensions, screenshots, and crash dumps.

**Replace with**: PKCE + authorization-code-grant + cookie-based
delivery, OR a short-lived single-use exchange code that the client
swaps server-side for the access token.

#### 3. Permissive CORS fallback

`apps/api/src/plugins/cors.ts:14`:

```ts
if (!origin) return callback(null, true);
```

Non-browser callers (curl, server-to-server) get a wildcard pass.
Combined with `credentials: true`, an attacker with a stolen
refresh-cookie value can call the API with no `Origin` and full
credentials. Drop the `!origin → allow` branch unless there's an
active non-browser client documented.

#### 4. Pyodide loaded over `importScripts` from a CDN

`pyodide.worker.ts:3`:

```ts
importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');
```

If jsDelivr is compromised or the URL hijacked, attackers run code
in every learner's browser. Workers don't support SRI for
`importScripts` natively.

**Options**:

- Self-host the Pyodide bundle (~20 MB added to the CF Pages site).
- Pin via Cloudflare Workers proxy + SRI on the proxy.

### P1 — Significant, plan for it

#### 5. No password-strength check beyond `min(8)`

`packages/validators/src/index.ts` accepts `"password"`,
`"12345678"`, `"qwertyui"`. Hook up `zxcvbn` or check against the
common-password list (pwned-passwords k-anon API, or a static
top-1k list bundled).

#### 6. No account lockout on failed logins

Rate-limit is **per-IP at 10/min** (login). Distributed attack
against a single account is feasible. Add per-account lockout after
N failed attempts in M minutes, with exponential backoff.

#### 7. No email verification on register

User can register as `victim@example.com`, then bombard them with
password-reset emails. Email-verification flow (send confirmation
link, require click before activating) plugs this and improves
deliverability.

#### 8. Per-IP rate limits don't stop distributed abuse

Bot farms rotate IPs cheaply. Add **Cloudflare Turnstile** (free
CAPTCHA) on `/auth/register`, `/auth/password-reset/request`, plus
per-account rate limits as a second layer.

#### 9. Mixed `sameSite` policy on refresh cookie

Password flow sets `sameSite: 'strict'`, OAuth flow sets
`sameSite: 'lax'`. Two cookies with the same name (`lc_rt`) but
different policies — whichever is set last wins. Standardize on one
(recommend `'lax'` for full functionality, or implement an
OAuth-specific cookie name).

#### 10. `password_resets.token_hash` uses SHA-256

Fast hash, brute-forceable in microseconds per guess if the DB
leaks. The tokens are 32-byte random (2^256 space) so brute-force
is academic, but the practice is to use bcrypt/argon2 for any
persisted user-controlled secret.

#### 11. No CSP

`server.ts` explicitly disables Helmet's CSP
(`contentSecurityPolicy: false`). For the web app (served by
Cloudflare Pages), add CSP headers via `apps/web/public/_headers`.

Suggested starting policy:

```
Content-Security-Policy: default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  connect-src 'self' https://api.learncode.study https://*.sentry.io https://*.ingest.sentry.io;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  frame-ancestors 'none';
```

#### 12. No audit log

Login, OAuth-link, password-change, hint-reveal — none are logged
with structured user-id context. After an account compromise, you
can't reconstruct "when did this happen". Add an `audit_events`
table with `(userId, action, metadata, createdAt, ipAddress,
userAgent)`.

### P2 — Worth knowing about

- **JWT_SECRET is symmetric (HS256)** — if the API host is
  compromised, all tokens are forgeable. RS256 with a private key in
  env + public key for verification raises the bar.
- **No HSTS preload submission** — first-visit users still
  vulnerable to SSL stripping.
- **CAA records on `learncode.study`** — without them, any CA can
  issue certs.
- **Sentry might capture sensitive data** — confirm `beforeSend`
  filter / `denyUrls` excludes auth bodies.
- **No 2FA** — passwords + cookie sessions only.
- **Refresh token revocation isn't bulk-deletable from any UI** —
  admin can't "log out user X from all devices" except via DB or
  password reset.
- **No timing-safe comparison** for token-hash lookup. Negligible in
  practice (network jitter dominates), but documenting.

---

## 🎨 UI/UX features to consider

### High value — most users will hit these

#### Account management
- **Settings page** with: change email, change password (currently
  only via "forgot password"), connect/disconnect OAuth providers,
  delete account (GDPR-friendly).
- **Profile**: display name (vs. email prefix), avatar upload,
  optional bio.
- **2FA enrollment** (TOTP via `otplib`).

#### Progress motivation
- **Daily streak counter** ("3 days in a row") on the Landing — best
  single retention lever for learning apps.
- **Total time spent** per problem and per language.
- **Per-problem solved-at timestamp** on the module detail.
- **Completion certificates** for finishing a language (PDF or
  share-card image).
- **Weekly progress email** (Resend is already wired up).

#### Learning flow
- **Search bar** on `/languages` and `/learn/:lang` ("Find a problem
  by title or keyword").
- **Filter chips**: difficulty, status (solved / in-progress /
  locked).
- **Compare-with-canonical** after passing — show your code next to
  the expected solution side-by-side.
- **Notes/bookmarks** per problem (per-user `notes` table).
- **Recently viewed** list on Landing.

#### Onboarding
- **First-time tour** in the workspace — three pop-overs explaining:
  editor / Run+Submit / hints.
- **Welcome modal after first login** ("Pick a language to start").
- **"What's next" CTA** at the end of every module.

#### Error states
Right now several places assume the happy path:

- `/modules` returns 401 → frontend probably shows "Loading…"
  indefinitely.
- API offline → no toast, no banner, requests just hang or timeout
  silently.
- Add a global **API connection banner** + retry button when
  `/health` fails.

### Medium value — improves polish

#### Accessibility (a11y)

A quick `axe-core` pass on key pages will surface:

- Missing `aria-label` on icon buttons (avatar, stop, log out, etc.).
- Low-contrast `text-slate-400 on bg-white` — fails WCAG AA.
- Focus rings on Tailwind defaults are weak — many keyboard users
  can't tell which button is focused.
- `MobileModuleStrip` tiles need `aria-current` when selected.
- Heading order isn't always semantic (h1 → h3 jumps).

#### Workspace polish
- **Diff view** comparing the user's current code to their last
  passing submission.
- **Submission history** per problem (last N attempts, scores,
  timestamps).
- **Solution unlock after pass**: show the canonical solution +
  walkthrough.
- **Keyboard shortcuts**: `Cmd+Enter` to Run, `Cmd+Shift+Enter` to
  Submit, `?` to open help.
- **Auto-save indicator** ("Saved 3s ago"). Code currently lives in
  Zustand and is lost on tab close. Persist to localStorage per
  problem.

#### Mobile gaps
- **PWA manifest + `_headers` cache rules**, "Add to Home Screen"
  prompt.
- **Better keyboard handling** on the workspace — keyboard occluding
  the toolbar is fixed, but the stdin textarea doesn't auto-scroll.
- **Bottom navigation bar** for primary routes (Landing / Languages /
  Profile).

#### Visual / content
- **Dark mode** — Tailwind makes this almost free (`dark:` variants).
  Big nice-to-have for night studying.
- **Skeleton loaders** on Landing, Languages, LanguageView
  (currently just "Loading…" text).
- **Empty states**: "You haven't started any problems yet" with a
  link back to a starter module.

### Low value — only if you're polishing

#### Social / community
- Per-problem discussion (very expensive to moderate).
- Shareable "I solved X" cards.
- Public profiles / friends list.

#### Admin authoring
- In-app problem editor (instead of seed files).
- Usage analytics: which problems get stuck on, where users drop off.
- A/B test infrastructure for hint orderings.

#### Educational features
- Spaced repetition: bring back problems you struggled with after
  1d / 1w / 1m.
- "What you're weak on" recommendation surfacing.
- Multi-file problems (medium effort).
- A real **Playground** (no test cases, just code + Run + stdin) on
  its own route.

---

## 📋 Suggested first three moves

In order:

1. **`apps/web/public/_headers` with a strict CSP + HSTS.**
   One commit, low risk, mitigates #11 + half of #4.

2. **Sandbox the code runner.** Cheapest start: add
   `--network none` semantics to spawned processes (iptables at
   container boot, or move to judge0/piston as a separate service).
   This is the only real systemic security debt.

3. **Settings page** with change password / delete account / 2FA
   opt-in. Biggest user-facing gap.

---

## How to use this doc

- Pick an item, link a PR with `closes docs/TO_UPGRADE.md#<n>` in the
  description.
- Strike through (`~~item~~`) or delete the entry as work lands.
- Add new findings under the right priority bucket as they surface.
- Don't leave the list ordered by date — keep it priority-ordered so
  the next "what should I do?" question is one read away.
