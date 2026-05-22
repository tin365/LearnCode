import type { FastifyInstance } from 'fastify';
import oauthPlugin, { type OAuth2Namespace } from '@fastify/oauth2';
import { env } from '../config/env.js';
import { issueExchangeCode } from '../lib/oauthExchange.js';

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

    // Hand off via a one-time exchange code instead of putting the
    // access token in the URL fragment. The SPA POSTs the code to
    // /auth/oauth-exchange, which issues the access token + refresh
    // cookie at that point. Eliminates the fragment leak surface
    // (history, location.hash, screenshots, extensions). See
    // TO_UPGRADE.md P0 #2.
    const code = await issueExchangeCode(fastify.prisma, user.id);
    return reply.redirect(
      `${frontendBase}/auth/oauth-complete?code=${encodeURIComponent(code)}`,
    );
  });
}
