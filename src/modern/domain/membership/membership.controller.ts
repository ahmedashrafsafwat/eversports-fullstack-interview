import { Request, Response } from 'express';
import { CreateMembershipCommand } from '../../application/use-cases/membership/commands/create-membership/create-membership.command';
import { GetAllMembershipsCommand } from '../../application/use-cases/membership/commands/get-all-memberships/get-all-memberships.command';
import { TYPES } from '../../core/types/types.interface';
import { inject, injectable } from 'inversify';
import { CreateMembershipHandler } from '../../application/use-cases/membership/commands/create-membership/create-membership.handler';
import { GetAllMembershipsHandler } from '../../application/use-cases/membership/commands/get-all-memberships/get-all-memberships.handler';
import { logMethod } from '../../core/decorators/logMethod';

@injectable()
export class MembershipController {
  constructor(
    @inject(TYPES.CreateMembershipHandler)
    private createMembershipHandler: CreateMembershipHandler,
    @inject(TYPES.GetAllMembershipsHandler)
    private getAllMembershipsHandler: GetAllMembershipsHandler
  ) {}

  @logMethod()
  async createMembership(req: Request, res: Response): Promise<Response> {
    try {
      // We're using a fixed user ID for simplicity - in a real app this would come from authentication
      const user = 2000;

      const command = new CreateMembershipCommand(
        req.body.name,
        req.body.recurringPrice,
        req.body.paymentMethod,
        req.body.billingPeriods,
        req.body.billingInterval,
        new Date(req.body.validFrom),
        user // This should be replaced with the actual user ID generated we get from the auth middleware
      );

      const result = await this.createMembershipHandler.handle(command);

      return res.status(201).json(result);
    } catch (error) {
      console.error('Error creating membership:', error);
      return res.status(500).json({ error: 'Failed to create membership' });
    }
  }

  @logMethod()
  async getAllMemberships(_req: Request, res: Response): Promise<void> {
    try {
      const command = new GetAllMembershipsCommand();

      const memberships = await this.getAllMembershipsHandler.handle(command);

      res.status(200).json(memberships);
    } catch (error) {
      console.error('Error fetching memberships:', error);
      res.status(500).json({ error: 'Failed to fetch memberships' });
    }
  }
}
