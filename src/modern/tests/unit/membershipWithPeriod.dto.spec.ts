import test from 'ava';
import { Membership } from '../../domain/membership/membership.model';
import { MembershipPeriod } from '../../domain/membership/membershipPeriod/membershipPeriod.model';
import { MembershipDto } from '../../application/dto/membership.dto';
import { MembershipPeriodDto } from '../../application/dto/membershipPeriod.dto';
import { MembershipWithPeriodDto } from '../../application/dto/membershipWithPeriod.dto';
import sinon from 'sinon';
import {
  membershipResponse1,
  membershipResponse2,
  mockMembership1,
  mockMembership2,
  period1,
  period2,
  period3,
  periodResponse1,
  periodResponse2,
  periodResponse3
} from '../fixtures/membership.fixtures';

// Setup mocks and test data
test.beforeEach((t) => {
  // Store test data and stubs in the test context
  t.context = {
    mockMembership1,
    mockMembership2,
    period1,
    period2,
    period3,
    membershipResponse1,
    membershipResponse2,
    periodResponse1,
    periodResponse2,
    periodResponse3
  };
});

// Cleanup stubs after each test
test.afterEach.always((t) => {
  sinon.restore();
});

test('fromDomain should convert one membership and its periods to DTO', (t) => {
  const {
    mockMembership1,
    period1,
    period2,
    membershipResponse1,
    periodResponse1,
    periodResponse2
  } = t.context as any;

  const result = MembershipWithPeriodDto.fromDomain(mockMembership1, [
    period1,
    period2
  ]);

  t.deepEqual(result, {
    membership: membershipResponse1,
    membershipPeriods: [periodResponse1, periodResponse2]
  });
});

test('fromDomain should handle empty periods array', (t) => {
  const { mockMembership1, membershipResponse1 } = t.context as any;

  const result = MembershipWithPeriodDto.fromDomain(mockMembership1, []);

  t.deepEqual(result, {
    membership: membershipResponse1,
    membershipPeriods: []
  });
});

test('fromDomainList should convert multiple memberships with their periods', (t) => {
  const memberships = [mockMembership1, mockMembership2];
  const allPeriods = [period1, period2, period3];

  const result = MembershipWithPeriodDto.fromDomainList(
    memberships,
    allPeriods
  );

  t.deepEqual(result, [
    {
      membership: membershipResponse1,
      membershipPeriods: [periodResponse1, periodResponse2]
    },
    {
      membership: membershipResponse2,
      membershipPeriods: [periodResponse3]
    }
  ]);
});

test('fromDomainList should handle empty memberships array', (t) => {
  const { period1, period2, period3 } = t.context as any;
  const allPeriods = [period1, period2, period3];

  const result = MembershipWithPeriodDto.fromDomainList([], allPeriods);

  t.deepEqual(result, []);
});

test('fromDomainList should handle empty periods array', (t) => {
  const {
    mockMembership1,
    mockMembership2,
    membershipResponse1,
    membershipResponse2
  } = t.context as any;
  const memberships = [mockMembership1, mockMembership2];

  const result = MembershipWithPeriodDto.fromDomainList(memberships, []);

  t.deepEqual(result, [
    {
      membership: membershipResponse1,
      membershipPeriods: []
    },
    {
      membership: membershipResponse2,
      membershipPeriods: []
    }
  ]);
});

test('fromDomainList should correctly filter periods by membership id', (t) => {
  const result = MembershipWithPeriodDto.fromDomainList(
    [mockMembership1],
    [period1, period3]
  );
  t.deepEqual(result, [
    {
      membership: membershipResponse1,
      membershipPeriods: [periodResponse1]
    }
  ]);
});
