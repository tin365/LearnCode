import 'dotenv/config';
import { env } from './config/env.js';
import { initSentry } from './lib/sentry.js';
import { buildServer } from './server.js';

// Init Sentry BEFORE the server boots so any startup errors are captured.
initSentry();

const SHUTDOWN_TIMEOUT_MS = 10_000;

async function main() {
  const server = await buildServer();

  const shutdown = async (signal: NodeJS.Signals) => {
    server.log.info({ signal }, 'Shutdown signal received, draining...');
    // Hard cap — if Fastify can't close in time (stuck handler, DB hang),
    // exit anyway so the orchestrator can replace the pod.
    const timer = setTimeout(() => {
      server.log.error('Graceful shutdown timed out, forcing exit');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    timer.unref();

    try {
      await server.close();
      process.exit(0);
    } catch (err) {
      server.log.error({ err }, 'Error during shutdown');
      process.exit(1);
    }
  };

  process.once('SIGTERM', () => void shutdown('SIGTERM'));
  process.once('SIGINT', () => void shutdown('SIGINT'));

  try {
    await server.listen({ port: env.API_PORT, host: env.API_HOST });
    console.log(`API listening on http://${env.API_HOST}:${env.API_PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
