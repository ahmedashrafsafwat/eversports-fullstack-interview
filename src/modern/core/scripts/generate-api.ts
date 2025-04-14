import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import config from '../../../config/index';
// Define paths
const openapiYamlPath = config.api.SPEC_PATH;
const outputDir = path.resolve(__dirname, '../types/');
const outputFileName = 'apiGenerated.interface.ts';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate TypeScript types from OpenAPI spec
console.log('Generating TypeScript types from OpenAPI spec...');
execSync(
  `openapi-typescript ${openapiYamlPath} --output ${path.join(
    outputDir,
    outputFileName
  )} --enum`,
  { stdio: 'inherit' }
);

console.log('API code generation completed!');
