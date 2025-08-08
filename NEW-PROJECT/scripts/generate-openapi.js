/**
 * Simple script to copy the OpenAPI specification into the dist directory.
 * This script is run by the `ov:generate` npm script. It reads the
 * `apps/api/openapi.json` file and writes it to `dist/openapi.json` at
 * the project root. If the destination directory does not exist, it
 * will be created. This approach avoids complex zod-openapi
 * integration in early stages and provides a canonical location for
 * the spec.
 */

const fs = require('fs');
const path = require('path');

function copyOpenApi() {
  const rootDir = path.join(__dirname, '..');
  const src = path.join(rootDir, 'apps', 'api', 'openapi.json');
  const destDir = path.join(rootDir, 'dist');
  const dest = path.join(destDir, 'openapi.json');

  // Ensure destination directory exists
  fs.mkdirSync(destDir, { recursive: true });
  // Copy file
  fs.copyFileSync(src, dest);
  console.log(`OpenAPI spec copied to ${dest}`);
}

try {
  copyOpenApi();
} catch (err) {
  console.error('Failed to copy OpenAPI spec:', err);
  process.exit(1);
}