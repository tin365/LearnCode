import 'dotenv/config';
import { env } from './config/env.js';
import { buildServer } from './server.js';

async function main() {
  const server = await buildServer();
  try {
    await server.listen({ port: env.API_PORT, host: env.API_HOST });
    console.log(`API listening on http://${env.API_HOST}:${env.API_PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
