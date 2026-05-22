import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { env } from '../config/env.js';

const TAURI_ORIGINS = ['tauri://localhost', 'https://tauri.localhost'];

const allowedOrigins = new Set<string>([...env.WEB_ORIGINS, ...TAURI_ORIGINS]);

export default fp(async (fastify) => {
  await fastify.register(cors, {
    credentials: true,
    origin: (origin, callback) => {
      // No Origin header: non-browser caller (curl, Render's health
      // probe, server-to-server). Reject for CORS purposes — the
      // response still goes out (CORS is browser-side only), it just
      // ships without Access-Control-Allow-Origin headers. Non-browsers
      // don't enforce CORS so they keep working; browsers attempting to
      // bypass our allowlist by omitting the Origin header are blocked.
      // Real auth still relies on JWT/cookie checks at the route layer.
      if (!origin) return callback(null, false);
      if (allowedOrigins.has(origin)) return callback(null, true);
      fastify.log.warn({ origin }, 'CORS: rejected origin');
      return callback(null, false);
    },
  });
});
