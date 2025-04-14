import {
  MembershipPeriod,
  MembershipPeriodId
} from '../../../domain/membershipPeriod/membershipPeriod.model';
import { MembershipId } from '../../../domain/membership/membership.model';

export default interface IMembershipPeriodRepository {
  findByMembershipId(membershipId: MembershipId): Promise<MembershipPeriod[]>;
  createMany(periods: MembershipPeriod[]): Promise<MembershipPeriod[]>;
  create(period: MembershipPeriod): Promise<MembershipPeriod>;
}
