import type { FastifyInstance } from 'fastify';
import oauthPlugin, { type OAuth2Namespace } from '@fastify/oauth2';
import { env } from '../config/env.js';
import { issueExchangeCode } from '../lib/oauthExchange.js';

declare module 'fastify' {
  interface FastifyInstance {
    facebookOAuth2: OAuth2Namespace;
  }
}

interface FacebookUserInfo {
  id: string;
  email?: string;
  name?: string;
}

export async function facebookOAuthRoutes(fastify: FastifyInstance) {
  if (
    !env.FACEBOOK_CLIENT_ID ||
    !env.FACEBOOK_CLIENT_SECRET ||
    !env.API_BASE_URL
  ) {
    fastify.log.warn(
      'Facebook OAuth disabled: requires FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, and API_BASE_URL',
    );
    return;
  }

  const frontendBase = env.WEB_ORIGINS[0];
  if (!frontendBase) {
    fastify.log.warn('Facebook OAuth disabled: no WEB_ORIGINS configured');
    return;
  }

  await fastify.register(oauthPlugin, {
    name: 'facebookOAuth2',
    scope: ['email', 'public_profile'],
    credentials: {
      client: {
        id: env.FACEBOOK_CLIENT_ID,
        secret: env.FACEBOOK_CLIENT_SECRET,
      },
      auth: oauthPlugin.FACEBOOK_CONFIGURATION,
    },
    startRedirectPath: '/auth/facebook',
    callbackUri: `${env.API_BASE_URL}/auth/facebook/callback`,
  });

  fastify.get('/auth/facebook/callback', async function (request, reply) {
    let userInfo: FacebookUserInfo;
    try {
      const tokenResult =
        await this.facebookOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
      // Facebook's Graph API; explicitly ask for email since profile alone
      // doesn't include it. Pin the API version to avoid silent breakage on
      // Graph upgrades.
      const res = await fetch(
        'https://graph.facebook.com/v18.0/me?fields=id,email,name',
        {
          headers: { Authorization: `Bearer ${tokenResult.token.access_token}` },
        },
      );
      if (!res.ok) {
        throw new Error(`Graph /me failed: ${res.status}`);
      }
      userInfo = (await res.json()) as FacebookUserInfo;
    } catch (err) {
      request.log.error({ err }, 'Facebook OAuth callback failed');
      return reply.redirect(`${frontendBase}/auth/oauth-error?provider=facebook`);
    }

    // Facebook lets the user opt out of sharing email. Without one we have
    // nothing to link against and can't seed a password-reset flow later.
    if (!userInfo.email) {
      return reply.redirect(
        `${frontendBase}/auth/oauth-error?reason=email_unverified&provider=facebook`,
      );
    }

    const existingOAuth = await fastify.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'facebook',
          providerAccountId: userInfo.id,
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
            provider: 'facebook',
            providerAccountId: userInfo.id,
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
                provider: 'facebook',
                providerAccountId: userInfo.id,
                email: userInfo.email,
              },
            },
          },
        });
      }
    }

    // One-time exchange code instead of a JWT in the URL fragment.
    // See TO_UPGRADE.md P0 #2 and lib/oauthExchange.ts.
    const code = await issueExchangeCode(fastify.prisma, user.id);
    return reply.redirect(
      `${frontendBase}/auth/oauth-complete?code=${encodeURIComponent(code)}`,
    );
  });
}
