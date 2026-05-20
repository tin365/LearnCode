import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { env } from '../config/env.js';

const TAURI_ORIGINS = ['tauri://localhost', 'https://tauri.localhost'];

const allowedOrigins = new Set<string>([...env.WEB_ORIGINS, ...TAURI_ORIGINS]);

export default fp(async (fastify) => {
  await fastify.register(cors, {
    credentials: true,
    origin: (origin, callback) => {
      // No Origin header: non-browser caller (curl, server-to-server,
      // some native clients). Allow — auth is enforced by JWT bearer.
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      fastify.log.warn({ origin }, 'CORS: rejected origin');
      return callback(null, false);
    },
  });
});
