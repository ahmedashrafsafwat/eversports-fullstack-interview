import express from 'express';
import { createMembershipRouter } from '../../domain/membership/membership.route';
import docRouters from './docs';
import healthRouters from './health';
const router = express.Router();

// Set up routes with dependencies from container
router.use('/memberships', createMembershipRouter());

// Set up docs routes
router.use('/api', docRouters);

// Set up health check route
router.use('/health', healthRouters);

export default router;
