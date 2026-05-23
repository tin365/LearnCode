-- Ad-hoc analytics queries against the LearnCode Postgres (Neon).
-- Run these in Neon's SQL Editor (cloud.neon.tech → project → SQL Editor)
-- or against any psql session pointed at DATABASE_URL.
--
-- The Prisma schema maps PascalCase models to snake_case tables and
-- camelCase fields to snake_case columns (e.g. Progress -> progress,
-- completedAt -> completed_at). Reference query at the bottom lists
-- every available table.

-- =========================================================================
-- Headline numbers — paste into a Reddit reply or your own dashboard
-- =========================================================================
SELECT
  (SELECT COUNT(*) FROM users)                                               AS total_users,
  (SELECT COUNT(*) FROM progress WHERE passed = true)                        AS total_passes,
  (SELECT COUNT(*) FROM progress
     WHERE passed = true
       AND completed_at > NOW() - INTERVAL '24 hours')                       AS passes_last_24h,
  (SELECT COUNT(DISTINCT user_id) FROM progress
     WHERE completed_at > NOW() - INTERVAL '7 days')                         AS active_users_last_7d;

-- =========================================================================
-- Signups per day (last 14 days)
-- =========================================================================
SELECT
  DATE(created_at) AS day,
  COUNT(*)         AS new_users
FROM users
WHERE created_at > NOW() - INTERVAL '14 days'
GROUP BY day
ORDER BY day DESC;

-- =========================================================================
-- Funnel: signup -> first attempt -> first pass
-- Tells you where new users are dropping off.
-- =========================================================================
SELECT
  COUNT(*)                                                AS registered,
  COUNT(*) FILTER (WHERE first_attempt IS NOT NULL)       AS attempted,
  COUNT(*) FILTER (WHERE first_pass IS NOT NULL)          AS passed_at_least_one
FROM (
  SELECT
    u.id,
    MIN(p.id)                                              AS first_attempt,
    MIN(p.id) FILTER (WHERE p.passed)                      AS first_pass
  FROM users u
  LEFT JOIN progress p ON p.user_id = u.id
  GROUP BY u.id
) per_user;

-- =========================================================================
-- Top 10 most-attempted problems (and how often they're passed)
-- =========================================================================
SELECT
  m.language,
  p.title,
  COUNT(*)                                          AS attempts,
  SUM(CASE WHEN pr.passed THEN 1 ELSE 0 END)        AS passes,
  ROUND(100.0 * SUM(CASE WHEN pr.passed THEN 1 ELSE 0 END) / COUNT(*), 1)
                                                    AS pass_rate_pct
FROM progress pr
JOIN problems p ON p.id = pr.problem_id
JOIN modules  m ON m.id = p.module_id
GROUP BY p.id, p.title, m.language
ORDER BY attempts DESC
LIMIT 10;

-- =========================================================================
-- Activity by language (last 7 days)
-- Which curriculum tracks are actually being used?
-- =========================================================================
SELECT
  m.language,
  COUNT(DISTINCT pr.user_id)                        AS active_users,
  COUNT(*)                                          AS submissions,
  SUM(CASE WHEN pr.passed THEN 1 ELSE 0 END)        AS passes
FROM progress pr
JOIN problems p ON p.id = pr.problem_id
JOIN modules  m ON m.id = p.module_id
WHERE pr.completed_at > NOW() - INTERVAL '7 days'
GROUP BY m.language
ORDER BY submissions DESC;

-- =========================================================================
-- Top 10 learners (most problems passed)
-- =========================================================================
SELECT
  u.email,
  u.created_at::date                          AS joined,
  COUNT(*) FILTER (WHERE pr.passed)           AS solved,
  SUM(pr.hints_used)                          AS total_hints,
  MAX(pr.completed_at)::date                  AS last_pass_at
FROM users u
JOIN progress pr ON pr.user_id = u.id
GROUP BY u.id, u.email, u.created_at
HAVING COUNT(*) FILTER (WHERE pr.passed) > 0
ORDER BY solved DESC
LIMIT 10;

-- =========================================================================
-- Hint usage — are problems too hard? Too easy?
-- High hints-per-pass = problems may be over-tuned.
-- =========================================================================
SELECT
  m.language,
  COUNT(*) FILTER (WHERE pr.passed)                                                AS passes,
  ROUND(AVG(pr.hints_used) FILTER (WHERE pr.passed)::numeric, 2)                   AS avg_hints_per_pass,
  COUNT(*) FILTER (WHERE pr.passed AND pr.hints_used = 0)                          AS passes_with_no_hints,
  COUNT(*) FILTER (WHERE pr.passed AND pr.hints_used = 3)                          AS passes_with_all_hints
FROM progress pr
JOIN problems p ON p.id = pr.problem_id
JOIN modules  m ON m.id = p.module_id
GROUP BY m.language
ORDER BY m.language;

-- =========================================================================
-- New-user retention (came back 1+ day after registering)
-- =========================================================================
SELECT
  DATE(u.created_at)                                                              AS signup_day,
  COUNT(*)                                                                        AS signups,
  COUNT(*) FILTER (WHERE pr.completed_at > u.created_at + INTERVAL '1 day')       AS returned_after_1d
FROM users u
LEFT JOIN progress pr ON pr.user_id = u.id
WHERE u.created_at > NOW() - INTERVAL '30 days'
GROUP BY signup_day
ORDER BY signup_day DESC;

-- =========================================================================
-- OAuth vs password sign-up split
-- =========================================================================
SELECT
  CASE
    WHEN u.password_hash IS NULL THEN 'oauth_only'
    WHEN EXISTS (SELECT 1 FROM oauth_accounts oa WHERE oa.user_id = u.id) THEN 'password+oauth'
    ELSE 'password_only'
  END                                            AS auth_kind,
  COUNT(*)                                       AS users
FROM users u
GROUP BY auth_kind
ORDER BY users DESC;

-- =========================================================================
-- Reference: every table in the DB
-- =========================================================================
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
