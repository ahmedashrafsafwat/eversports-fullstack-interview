import express from 'express';
import bodyParser from 'body-parser';
import { errorHandler } from './modern/core/middlewares/error-handler.middleware';
import dotenv from 'dotenv';
import router from './modern/api/routes';
import { getApiPrefix } from './config/api-prefix';
dotenv.config();

// because of the javascript module, we need to use require to import the legacy routes
const legacyMembershipRoutes = require('./legacy/routes/membership.routes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

// OpenAPI request validation
// app.use(
//   OpenApiValidator.middleware({
//     apiSpec: openapiYamlPath,
//     validateRequests: true,
//     validateResponses: true
//   })
// );

const apiPerfix = getApiPrefix();

// Serve the app modern routes
app.use(apiPerfix, router);

app.use(errorHandler);

// Serve the legacy routes
app.use('/legacy/memberships', legacyMembershipRoutes);

// Unhandled Route
// app.use('*', (req: Request, res: Response, next: NextFunction) => {
//   next(new ApiError(404, `Route ${req.originalUrl} not found`));
// });

const PORT = process.env.PORT || 3000;

export const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api/docs`);
});

export default app;
