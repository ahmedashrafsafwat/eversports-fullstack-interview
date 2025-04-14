import { Router } from 'express';
import { MembershipController } from './membership.controller';
import { subscriptionValidator } from '../../core/middlewares/validateMembership';
import { TYPES } from '../../core/types/types.interface';
import { Container } from '../../infrastructure/di/container';

export const createMembershipRouter = (): Router => {
  const router = Router();

  const container = Container.getInstance();

  const membership = container.get<MembershipController>(
    TYPES.MembershipController
  );

  /**
   * @route POST /memberships
   * @desc Create a new membership
   */
  router.post('', subscriptionValidator, (req, res) =>
    membership.createMembership(req, res)
  );

  /**
   * @route GET /memberships
   * @desc List all memberships
   */
  router.get('', (req, res) => membership.getAllMemberships(req, res));

  return router;
};
