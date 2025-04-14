import { Membership } from '../../domain/membership/membership.model';
import { MembershipPeriod } from '../../domain/membershipPeriod/membershipPeriod.model';
import { MembershipDto, MembershipResponseDto } from './membership.dto';
import {
  MembershipPeriodDto,
  MembershipPeriodResponseDto
} from './membershipPeriod.dto';

export interface MembershipWithPeriodsDto {
  membership: MembershipResponseDto;
  membershipPeriods: MembershipPeriodResponseDto[];
}

export class MembershipWithPeriodDto {
  public static fromDomain(
    membership: Membership,
    periods: MembershipPeriod[]
  ): MembershipWithPeriodsDto {
    return {
      membership: MembershipDto.fromDomain(membership),
      membershipPeriods: MembershipPeriodDto.fromDomainList(periods)
    };
  }

  public static fromDomainList(
    memberships: Membership[],
    allPeriods: MembershipPeriod[]
  ): MembershipWithPeriodsDto[] {
    return memberships.map((membership) => {
      const membershipPeriods = allPeriods.filter(
        (period) => period.membershipId === membership.id
      );
      return this.fromDomain(membership, membershipPeriods);
    });
  }
}
