import { faker } from '@faker-js/faker';
import {
  BillingInterval,
  MembershipPeriodState,
  MembershipState,
  PaymentMethod
} from '../../core/types/apiGenerated.interface';
import { Membership } from '../../domain/membership/membership.model';
import { MembershipPeriod } from '../../domain/membership/membershipPeriod/membershipPeriod.model';
import {
  CreateMembershipDto,
  MembershipResponseDto
} from '../../application/dto/membership.dto';
import {
  CreateMembershipPeriodDto,
  MembershipPeriodResponseDto
} from '../../application/dto/membershipPeriod.dto';

export const createValidMembershipInput = {
  name: faker.person.fullName(),
  recurringPrice: faker.number.float({ min: 0, max: 100 }),
  paymentMethod: faker.helpers.arrayElement([
    'cash',
    'credit',
    'debit',
    'bank_transfer'
  ]),
  billingPeriods: 10,
  billingInterval: faker.helpers.arrayElement(['yearly']),
  validFrom: new Date().toISOString()
};

export const missingNameInValidMembershipInput = {
  recurringPrice: faker.number.float({ min: 100, max: 200 }),
  paymentMethod: faker.helpers.arrayElement([
    'cash',
    'credit',
    'debit',
    'bank_transfer'
  ]),
  billingPeriods: faker.number.int({ min: 7, max: 10 }),
  billingInterval: faker.helpers.arrayElement(['yearly']),
  validFrom: new Date().toISOString()
};

export const recurringPriceNotNumbereInValidMembershipInput = {
  ...createValidMembershipInput,
  recurringPrice: '123'
};

export const recurringPriceNegativeInValidMembershipInput = {
  ...createValidMembershipInput,
  recurringPrice: -123
};

export const recurringPriceLessThan100InValidMembershipInput = {
  ...createValidMembershipInput,
  paymentMethod: 'cash',
  recurringPrice: 120
};

export const billingIntervalMonthlyLessThan6InValidMembershipInput = {
  ...createValidMembershipInput,
  billingPeriods: 5,
  billingInterval: 'monthly'
};

export const billingIntervalMonthlyMoreThan12InValidMembershipInput = {
  ...createValidMembershipInput,
  billingPeriods: 13,
  billingInterval: 'monthly'
};

export const billingIntervalYearlyMoreThan10InValidMembershipInput = {
  ...createValidMembershipInput,
  billingPeriods: 11
};

export const billingIntervalYearlyLessThan2InValidMembershipInput = {
  ...createValidMembershipInput,
  billingPeriods: 2
};

export const billingIntervalInvalidInValidMembershipInput = {
  ...createValidMembershipInput,
  billingInterval: faker.helpers.arrayElement(['weekly'])
};

export const mockMembership1 = {
  id: 1,
  uuid: 'test-uuid',
  name: 'Basic Membership',
  state: MembershipState.active,
  validFrom: new Date('2023-01-01'),
  validUntil: new Date('2024-01-01'),
  user: 456,
  paymentMethod: PaymentMethod.cash,
  recurringPrice: 99.99,
  billingPeriods: 12,
  billingInterval: BillingInterval.monthly
} as Membership;

export const mockMembership2 = {
  id: 2,
  uuid: 'test-uuid-2',
  name: 'Premium Membership',
  state: MembershipState.expired,
  validFrom: new Date('2023-01-01'),
  validUntil: new Date('2024-01-01'),
  user: 102,
  paymentMethod: PaymentMethod.debit,
  recurringPrice: 19.99,
  billingPeriods: 6,
  billingInterval: BillingInterval.yearly
} as Membership;

export const period1 = {
  id: 11,
  uuid: 'period-test-uuid-1',
  state: MembershipPeriodState.active,
  membershipId: 1,
  start: new Date('2023-01-01'),
  end: new Date('2023-02-01')
} as MembershipPeriod;

export const period2 = {
  id: 12,
  membershipId: 1,
  uuid: 'period-test-uuid-2',
  state: MembershipPeriodState.expired,
  start: new Date('2023-02-01'),
  end: new Date('2023-03-01')
} as MembershipPeriod;

export const period3 = {
  id: 21,
  membershipId: 2,
  uuid: 'period-test-uuid-3',
  state: MembershipPeriodState.planned,
  start: new Date('2023-02-01'),
  end: new Date('2023-04-01')
} as MembershipPeriod;

export const membershipResponse1: MembershipResponseDto = {
  id: 1,
  uuid: 'test-uuid',
  name: 'Basic Membership',
  state: MembershipState.active,
  validFrom: new Date('2023-01-01'),
  validUntil: new Date('2024-01-01'),
  user: 456,
  paymentMethod: PaymentMethod.cash,
  recurringPrice: 99.99,
  billingPeriods: 12,
  billingInterval: BillingInterval.monthly
};

export const membershipResponse2: MembershipResponseDto = {
  id: 2,
  uuid: 'test-uuid-2',
  name: 'Premium Membership',
  state: MembershipState.expired,
  validFrom: new Date('2023-01-01'),
  validUntil: new Date('2024-01-01'),
  user: 102,
  paymentMethod: PaymentMethod.debit,
  recurringPrice: 19.99,
  billingPeriods: 6,
  billingInterval: BillingInterval.yearly
};

export const periodResponse1: MembershipPeriodResponseDto = {
  id: 11,
  membershipId: 1,
  start: new Date('2023-01-01'),
  end: new Date('2023-02-01'),
  state: MembershipPeriodState.active,
  uuid: 'period-test-uuid-1'
};

export const periodResponse2: MembershipPeriodResponseDto = {
  id: 12,
  membershipId: 1,
  start: new Date('2023-02-01'),
  end: new Date('2023-03-01'),
  state: MembershipPeriodState.expired,
  uuid: 'period-test-uuid-2'
};

export const periodResponse3: MembershipPeriodResponseDto = {
  id: 21,
  membershipId: 2,
  start: new Date('2023-02-01'),
  end: new Date('2023-04-01'),
  state: MembershipPeriodState.planned,
  uuid: 'period-test-uuid-3'
};

export const createMembershipdto: CreateMembershipDto = {
  name: 'Basic Membership',
  user: 2000,
  paymentMethod: PaymentMethod.cash,
  recurringPrice: 99.99,
  billingPeriods: 12,
  billingInterval: BillingInterval.monthly
};
export const createMembershipPerioddto: CreateMembershipPeriodDto = {
  membershipId: 1,
  start: new Date('2023-01-01'),
  end: new Date('2023-02-01'),
  state: MembershipPeriodState.active
};
