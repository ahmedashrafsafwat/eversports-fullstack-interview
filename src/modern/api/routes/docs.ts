import express from 'express';
import config from '../../../config';
import yaml from 'yaml';
import * as fs from 'fs';
import swaggerUi from 'swagger-ui-express';

const router = express.Router();

// Load OpenAPI spec
const openapiYamlPath = config.api.SPEC_PATH;
const openapiDocument = yaml.parse(fs.readFileSync(openapiYamlPath, 'utf8'));

// Serve OpenAPI UI document
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(openapiDocument));

// Serve OpenAPI spec in json format
router.route('/spec.json').get((req, res) => {
  res.json(openapiDocument);
});

export default router;
