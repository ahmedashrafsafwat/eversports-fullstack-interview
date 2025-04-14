import { MembershipWithPeriodsDto } from '../../application/dto/membershipWithPeriod.dto';
import { MembershipPeriodState } from '../../core/types/apiGenerated.interface';
import {
  mockMembership1,
  period1,
  period2,
  periodResponse1,
  periodResponse2,
  periodResponse3
} from './membership.fixtures';

export const mockMembershipWithPeriods: MembershipWithPeriodsDto = {
  membership: mockMembership1,
  membershipPeriods: [
    {
      id: 11,
      uuid: 'period-test-uuid-1',
      state: MembershipPeriodState.active,
      membershipId: 1,
      start: new Date('2023-01-01'),
      end: new Date('2023-02-01')
    }
  ]
};

export const mockMembershipsWithPeriodsArr: MembershipWithPeriodsDto[] = [
  {
    membership: mockMembership1,
    membershipPeriods: [periodResponse1, periodResponse3]
  },
  {
    membership: mockMembership1,
    membershipPeriods: [periodResponse2]
  }
];
