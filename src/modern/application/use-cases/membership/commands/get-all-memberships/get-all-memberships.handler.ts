import { CommandHandler } from '../base/command-handler';
import { GetAllMembershipsCommand } from './get-all-memberships.command';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../../core/types/types.interface';
import { MembershipService } from '../../../../../domain/membership/membership.service';
import { MembershipWithPeriodsDto } from '../../../../dto/membershipWithPeriod.dto';
import { logMethod } from '../../../../../core/decorators/logMethod';

@injectable()
export class GetAllMembershipsHandler
  implements
    CommandHandler<GetAllMembershipsCommand, MembershipWithPeriodsDto[]>
{
  constructor(
    @inject(TYPES.MembershipService)
    private membershipService: MembershipService
  ) {}

  @logMethod()
  async handle(
    command: GetAllMembershipsCommand
  ): Promise<MembershipWithPeriodsDto[]> {
    return this.membershipService.getAllMemberships();
  }
}
