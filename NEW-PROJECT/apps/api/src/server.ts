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
import { qcmToggleFavoritePlugin } from './plugins/qcm/toggleFavorite/index';
import { qcmGetPlugin } from './plugins/qcm/get/index';
import { qcmUpdatePlugin } from './plugins/qcm/update/index';
import { questionGetPlugin } from './plugins/question/get/index';
import { questionEditPlugin } from './plugins/question/edit/index';
import { pageGetPlugin } from './plugins/page/get/index';
import { pageEditPlugin } from './plugins/page/edit/index';
import { pageReorderPlugin } from './plugins/page/reorder/index';
import { pageCreatePlugin } from './plugins/page/create/index';
import { pageDeletePlugin } from './plugins/page/delete/index';
import { questionCreatePlugin } from './plugins/question/create/index';
import { questionDeletePlugin } from './plugins/question/delete/index';
import { questionReorderPlugin } from './plugins/question/reorder/index';
import { qcmUpdateStatsPlugin } from './plugins/qcm/updateStats/index';
import { qcmImportPlugin } from './plugins/qcm/import/index';
import { qcmExportPlugin } from './plugins/qcm/export/index';
import { auditListPlugin } from './plugins/audit/list/index';
import { authLoginPlugin } from './plugins/auth/login/index';
import { authRefreshPlugin } from './plugins/auth/refresh/index';
import { jwtAuthPlugin } from './plugins/auth/jwt';

/**
 * Factory function to build the Fastify server instance.  Additional
 * plugins should be registered here as they are implemented.  Keeping
 * server construction in a separate function facilitates testing by
 * allowing the server to be created without listening on a port.
 */
export async function buildServer() {
  const app = fastify();
  // Register global plugins.  JWT authentication plugin must be registered
  // before route plugins so that request.user is populated.
  await app.register(jwtAuthPlugin);
  // Authentication plugin for login endpoint
  await app.register(authLoginPlugin);
  // Authentication plugin for refresh endpoint
  await app.register(authRefreshPlugin);
  // Register API plugins.  Order matters for auth plugin to run before others.
  // QCM list plugin
  await app.register(qcmListPlugin);
  // QCM create plugin
  await app.register(qcmCreatePlugin);
  // QCM toggle favourite plugin
  await app.register(qcmToggleFavoritePlugin);
  // QCM get by ID plugin
  await app.register(qcmGetPlugin);
  // QCM update plugin
  await app.register(qcmUpdatePlugin);
  // Question get plugin
  await app.register(questionGetPlugin);
  // Question edit plugin
  await app.register(questionEditPlugin);
  // Page get plugin
  await app.register(pageGetPlugin);
  // Page edit plugin
  await app.register(pageEditPlugin);
  // Page reorder plugin
  await app.register(pageReorderPlugin);
  // Page create plugin
  await app.register(pageCreatePlugin);
  // Page delete plugin
  await app.register(pageDeletePlugin);
  // Question create plugin
  await app.register(questionCreatePlugin);
  // Question delete plugin
  await app.register(questionDeletePlugin);
  // Question reorder plugin
  await app.register(questionReorderPlugin);
  // QCM update stats plugin
  await app.register(qcmUpdateStatsPlugin);
  // QCM import plugin
  await app.register(qcmImportPlugin);
  // QCM export plugin
  await app.register(qcmExportPlugin);
  // Audit log listing plugin
  await app.register(auditListPlugin);
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