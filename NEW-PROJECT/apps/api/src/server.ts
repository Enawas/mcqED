/**
 * Purpose: Entry point for the Fastify API server. Registers plugins and
 * starts listening on the configured port.
 * Inputs: Environment variables (PORT, NODE_ENV, etc.).
 * Outputs: Running HTTP server.
 * Events: Audit events emitted by plugins.
 * Errors: Logs startup errors.
 */
// Import Fastify and the API plugins.  This server acts as the main
// application entry point in development and production environments.
import fastify from 'fastify';
import { qcmListPlugin } from './plugins/qcm/list/index';
import { qcmCreatePlugin } from './plugins/qcm/create/index';

/**
 * Factory function to build the Fastify server instance.  Additional
 * plugins should be registered here as they are implemented.  Keeping
 * server construction in a separate function facilitates testing by
 * allowing the server to be created without listening on a port.
 */
export async function buildServer() {
  const app = fastify();
  // Register API plugins.  For now we only register the QCM list plugin.
  // QCM list plugin
  await app.register(qcmListPlugin);
  // QCM create plugin
  await app.register(qcmCreatePlugin);
  return app;
}

// If this module is executed directly via `node dist/server.js`, create
// and start the server using the configured port.  This pattern avoids
// starting the server when imported for tests.
if (require.main === module) {
  const port = parseInt(process.env.PORT ?? '3000', 10);
  buildServer()
    .then((app) =>
      app.listen({ port }, (err, address) => {
        if (err) {
          app.log.error(err);
          process.exit(1);
        }
        // eslint-disable-next-line no-console
        console.log(`Fastify server listening on ${address}`);
      }),
    )
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(1);
    });
}