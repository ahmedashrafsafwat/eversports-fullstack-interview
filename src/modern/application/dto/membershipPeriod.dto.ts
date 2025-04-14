import { MembershipPeriod } from '../../domain/membership/membershipPeriod/membershipPeriod.model';
import { MembershipPeriodState } from '../../core/types/apiGenerated.interface';
import { InternalServerError } from '../../core/errors/appError';

export interface CreateMembershipPeriodDto {
  membershipId: number;
  start: Date;
  end: Date;
  state: MembershipPeriodState;
}

export interface MembershipPeriodResponseDto {
  id: number;
  uuid: string;
  membershipId: number;
  start: Date;
  end: Date;
  state: MembershipPeriodState;
}

export class MembershipPeriodDto {
  public static fromDomain(
    membershipPeriod: MembershipPeriod
  ): MembershipPeriodResponseDto {
    if (!membershipPeriod.membershipId) {
      throw new InternalServerError(
        'membershipId is undefined in domain model'
      );
    }

    return {
      id: membershipPeriod.id,
      uuid: membershipPeriod.uuid,
      membershipId: membershipPeriod.membershipId,
      start: membershipPeriod.start,
      end: membershipPeriod.end,
      state: membershipPeriod.state
    };
  }

  public static fromDomainList(
    membershipPeriods: MembershipPeriod[]
  ): MembershipPeriodResponseDto[] {
    return membershipPeriods.map((period) => this.fromDomain(period));
  }

  public static toDomain(dto: CreateMembershipPeriodDto): MembershipPeriod {
    return MembershipPeriod.create({
      membershipId: dto.membershipId,
      start: dto.start,
      end: dto.end,
      state: dto.state
    });
  }
}
