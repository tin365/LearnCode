import type { FastifyBaseLogger } from 'fastify';
import { env } from '../config/env.js';

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
  log: FastifyBaseLogger;
}

// Sends via Resend's HTTP API. If RESEND_API_KEY or EMAIL_FROM is unset,
// logs the email body to the API logger instead — fine for dev/staging
// where we still want to exercise the full flow.
export async function sendEmail({ to, subject, html, text, log }: SendArgs): Promise<void> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    log.warn(
      { to, subject, text },
      'Email not sent (RESEND_API_KEY / EMAIL_FROM unset). Dumping body to log.',
    );
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [to],
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend send failed (${res.status}): ${body}`);
  }
}

interface PasswordResetEmailArgs {
  to: string;
  resetUrl: string;
  log: FastifyBaseLogger;
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
  log,
}: PasswordResetEmailArgs): Promise<void> {
  await sendEmail({
    to,
    subject: 'Reset your LearnCode password',
    text: `Someone requested a password reset for your LearnCode account.

Open this link to set a new password (expires in 1 hour):
${resetUrl}

If you didn't request this, you can ignore this email — your password won't change.`,
    html: `<!doctype html>
<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0f172a;">
  <h1 style="font-size: 20px; margin-bottom: 16px;">Reset your LearnCode password</h1>
  <p>Someone requested a password reset for your LearnCode account.</p>
  <p style="margin: 24px 0;">
    <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500;">Set a new password</a>
  </p>
  <p style="font-size: 13px; color: #64748b;">This link expires in 1 hour. If you didn't request this, ignore this email — your password won't change.</p>
  <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">If the button doesn't work, paste this URL into your browser:<br>${resetUrl}</p>
</body></html>`,
    log,
  });
}

interface OAuthOnlyExplainerArgs {
  to: string;
  providers: string[];
  log: FastifyBaseLogger;
}

// Sent when someone requests a password reset for an account that has no
// password (signed up via Google/Facebook). Tells them which provider to
// use instead, without confirming the account exists if the email had no
// match at all (the request endpoint returns 204 either way).
export async function sendOAuthOnlyExplainer({
  to,
  providers,
  log,
}: OAuthOnlyExplainerArgs): Promise<void> {
  const list =
    providers.length === 1
      ? providers[0]
      : `${providers.slice(0, -1).join(', ')} and ${providers[providers.length - 1]}`;
  await sendEmail({
    to,
    subject: 'About your LearnCode password reset request',
    text: `You requested a password reset, but your LearnCode account doesn't have a password — you signed in with ${list}.

Go to https://learncode.study/login and use "Continue with ${providers[0]}" instead.`,
    html: `<!doctype html>
<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0f172a;">
  <h1 style="font-size: 20px; margin-bottom: 16px;">About your password reset request</h1>
  <p>You requested a password reset, but your LearnCode account doesn't have a password — you signed in with <strong>${list}</strong>.</p>
  <p>Go back to the <a href="https://learncode.study/login">login page</a> and use the <strong>Continue with ${providers[0]}</strong> button instead.</p>
</body></html>`,
    log,
  });
}
