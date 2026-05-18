import 'dotenv/config';
import { buildServer } from './server.js';

const port = parseInt(process.env.API_PORT || '3001', 10);
const host = process.env.API_HOST || '0.0.0.0';

async function main() {
  const server = await buildServer();
  try {
    await server.listen({ port, host });
    console.log(`API listening on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
