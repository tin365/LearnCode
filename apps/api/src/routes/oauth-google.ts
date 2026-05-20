import type { FastifyInstance, FastifyReply } from 'fastify';
import oauthPlugin, { type OAuth2Namespace } from '@fastify/oauth2';
import { env } from '../config/env.js';
import {
  COOKIE_NAME,
  type ClientKind,
  issueRefreshToken,
  refreshLifetimeMs,
} from '../lib/auth.js';

// @fastify/oauth2 decorates the Fastify instance using the `name` config.
declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
}

function setRefreshCookie(
  reply: FastifyReply,
  plaintext: string,
  clientKind: ClientKind,
) {
  reply.setCookie(COOKIE_NAME, plaintext, {
    path: '/auth',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    // 'lax' (not 'strict') because the cookie is set on a top-level
    // navigation back from accounts.google.com. Browsers won't send a
    // 'strict' cookie on the redirect-initiated request that follows.
    sameSite: 'lax',
    signed: true,
    maxAge: Math.floor(refreshLifetimeMs(clientKind) / 1000),
  });
}

export async function googleOAuthRoutes(fastify: FastifyInstance) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.API_BASE_URL) {
    fastify.log.warn(
      'Google OAuth disabled: requires GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and API_BASE_URL',
    );
    return;
  }

  const frontendBase = env.WEB_ORIGINS[0];
  if (!frontendBase) {
    fastify.log.warn('Google OAuth disabled: no WEB_ORIGINS configured');
    return;
  }

  await fastify.register(oauthPlugin, {
    name: 'googleOAuth2',
    scope: ['openid', 'email', 'profile'],
    credentials: {
      client: {
        id: env.GOOGLE_CLIENT_ID,
        secret: env.GOOGLE_CLIENT_SECRET,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/auth/google',
    callbackUri: `${env.API_BASE_URL}/auth/google/callback`,
  });

  fastify.get('/auth/google/callback', async function (request, reply) {
    let userInfo: GoogleUserInfo;
    try {
      const tokenResult =
        await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
      const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: { Authorization: `Bearer ${tokenResult.token.access_token}` },
      });
      if (!res.ok) {
        throw new Error(`userinfo request failed: ${res.status}`);
      }
      userInfo = (await res.json()) as GoogleUserInfo;
    } catch (err) {
      request.log.error({ err }, 'Google OAuth callback failed');
      return reply.redirect(`${frontendBase}/auth/oauth-error?provider=google`);
    }

    if (!userInfo.email_verified) {
      return reply.redirect(`${frontendBase}/auth/oauth-error?reason=email_unverified`);
    }

    // Identity lookup first. If we know this Google sub, that's the user.
    // Otherwise, match by email (auto-link policy) or create a new user
    // with no password.
    const existingOAuth = await fastify.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'google',
          providerAccountId: userInfo.sub,
        },
      },
      include: { user: true },
    });

    let user;
    if (existingOAuth) {
      user = existingOAuth.user;
    } else {
      const existingUser = await fastify.prisma.user.findUnique({
        where: { email: userInfo.email },
      });
      if (existingUser) {
        await fastify.prisma.oAuthAccount.create({
          data: {
            userId: existingUser.id,
            provider: 'google',
            providerAccountId: userInfo.sub,
            email: userInfo.email,
          },
        });
        user = existingUser;
      } else {
        user = await fastify.prisma.user.create({
          data: {
            email: userInfo.email,
            oauthAccounts: {
              create: {
                provider: 'google',
                providerAccountId: userInfo.sub,
                email: userInfo.email,
              },
            },
          },
        });
      }
    }

    // OAuth is web-only; desktop falls back to password login.
    const clientKind: ClientKind = 'web';
    const refresh = await issueRefreshToken(fastify.prisma, {
      userId: user.id,
      clientKind,
      userAgent: request.headers['user-agent'] ?? null,
      ipAddress: request.ip,
    });
    setRefreshCookie(reply, refresh.plaintext, clientKind);

    const accessToken = fastify.jwt.sign({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    // Fragment, not query — fragments aren't sent to the server and don't
    // appear in standard webserver access logs.
    return reply.redirect(
      `${frontendBase}/auth/oauth-complete#access=${encodeURIComponent(accessToken)}`,
    );
  });
}
