import { CommandHandler } from '../base/command-handler';
import { CreateMembershipCommand } from './create-membership.command';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../../core/types/types.interface';
import { MembershipWithPeriodsDto } from '../../../../dto/membershipWithPeriod.dto';
import { MembershipService } from '../../../../../domain/membership/membership.service';
import { logMethod } from '../../../../../core/decorators/logMethod';

@injectable()
export class CreateMembershipHandler
  implements CommandHandler<CreateMembershipCommand, MembershipWithPeriodsDto>
{
  constructor(
    @inject(TYPES.MembershipService)
    private membershipService: MembershipService
  ) {}

  async handle(
    command: CreateMembershipCommand
  ): Promise<MembershipWithPeriodsDto> {
    // Create a new membership entity
    const membership = await this.membershipService.createMembership({
      name: command.name,
      recurringPrice: command.recurringPrice,
      paymentMethod: command.paymentMethod,
      billingPeriods: command.billingPeriods,
      billingInterval: command.billingInterval,
      user: command.user
    });

    return membership;
  }
}
