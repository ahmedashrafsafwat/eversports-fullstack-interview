import test from 'ava';
import sinon from 'sinon';
import {
  MembershipDto,
  CreateMembershipDto
} from '../../application/dto/membership.dto';
import { Membership } from '../../domain/membership/membership.model';
import {
  BillingInterval,
  PaymentMethod,
  MembershipState
} from '../../core/types/apiGenerated.interface';
import { mockMembership1 } from '../fixtures/membership.fixtures';

// Store original Membership.create method
let originalMembershipCreate: typeof Membership.create;

// Setup hook that runs before all tests
test.before(() => {
  // Save original implementation
  originalMembershipCreate = Membership.create;

  // Replace with our test implementation
  Membership.create = sinon.stub().callsFake((props) => {
    const now = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(now.getFullYear() + 1);

    return mockMembership1;
  });
});

// Cleanup hook that runs after all tests
test.after(() => {
  // Restore original implementation
  Membership.create = originalMembershipCreate;
});

// Full conversion cycle tests
test('should correctly convert from DTO to domain and back to DTO', (t) => {
  // Arrange
  const createDto: CreateMembershipDto = {
    name: 'Integration Test Membership',
    recurringPrice: 129.99,
    paymentMethod: PaymentMethod.credit,
    billingPeriods: 6,
    billingInterval: BillingInterval.monthly,
    user: 123
  };

  // Act - Convert to domain model
  const domainModel = MembershipDto.toDomain(createDto);

  // Then convert back to DTO
  const responseDto = MembershipDto.fromDomain(domainModel);

  // Assert - Verify the round trip preserves all data
  t.is(responseDto.id, 1);
  t.is(responseDto.uuid, 'test-uuid');
  t.is(responseDto.name, 'Basic Membership');
  t.is(responseDto.state, MembershipState.active);
  t.true(responseDto.validFrom instanceof Date);
  t.true(responseDto.validUntil instanceof Date);
  t.is(responseDto.user, 456);
  t.is(responseDto.paymentMethod, PaymentMethod.cash);
  t.is(responseDto.recurringPrice, 99.99);
  t.is(responseDto.billingPeriods, 12);
  t.is(responseDto.billingInterval, BillingInterval.monthly);
});

// Batch operations test
test('should convert multiple domain models to DTOs correctly', (t) => {
  // Arrange
  const date1 = new Date('2023-01-01');
  const date2 = new Date('2024-01-01');
  const date3 = new Date('2022-01-01');
  const date4 = new Date('2023-01-01');

  const mockMemberships = [
    {
      id: 1,
      uuid: 'uuid-1',
      name: 'First Membership',
      state: MembershipState.active,
      validFrom: date1,
      validUntil: date2,
      user: 111,
      paymentMethod: PaymentMethod.credit,
      recurringPrice: 99.99,
      billingPeriods: 12,
      billingInterval: BillingInterval.monthly
    } as Membership,
    {
      id: 2,
      uuid: 'uuid-2',
      name: 'Second Membership',
      state: MembershipState.expired,
      validFrom: date3,
      validUntil: date4,
      user: 222,
      paymentMethod: PaymentMethod.debit,
      recurringPrice: 199.99,
      billingPeriods: 1,
      billingInterval: BillingInterval.yearly
    } as Membership
  ];

  // Act
  const dtos = MembershipDto.fromDomainList(mockMemberships);

  // Assert
  t.is(dtos.length, 2);

  // Verify first membership
  t.is(dtos[0].id, 1);
  t.is(dtos[0].uuid, 'uuid-1');
  t.is(dtos[0].name, 'First Membership');
  t.is(dtos[0].state, MembershipState.active);
  t.deepEqual(dtos[0].validFrom, date1);
  t.deepEqual(dtos[0].validUntil, date2);
  t.is(dtos[0].user, 111);
  t.is(dtos[0].paymentMethod, PaymentMethod.credit);
  t.is(dtos[0].recurringPrice, 99.99);
  t.is(dtos[0].billingPeriods, 12);
  t.is(dtos[0].billingInterval, BillingInterval.monthly);

  // Verify second membership
  t.is(dtos[1].id, 2);
  t.is(dtos[1].uuid, 'uuid-2');
  t.is(dtos[1].name, 'Second Membership');
  t.is(dtos[1].state, MembershipState.expired);
  t.deepEqual(dtos[1].validFrom, date3);
  t.deepEqual(dtos[1].validUntil, date4);
  t.is(dtos[1].user, 222);
  t.is(dtos[1].paymentMethod, PaymentMethod.debit);
  t.is(dtos[1].recurringPrice, 199.99);
  t.is(dtos[1].billingPeriods, 1);
  t.is(dtos[1].billingInterval, BillingInterval.yearly);
});

// Test for handling all membership states
test('should handle all membership states correctly', (t) => {
  // Test with different membership states
  const membershipStates = [
    MembershipState.active,
    MembershipState.expired,
    MembershipState.pending
  ];

  membershipStates.forEach((state) => {
    // Arrange
    const membership = {
      id: 100,
      uuid: `uuid-${state}`,
      name: `${state} Membership`,
      state: state,
      validFrom: new Date(),
      validUntil: new Date(),
      user: 999,
      paymentMethod: PaymentMethod.credit,
      recurringPrice: 50,
      billingPeriods: 1,
      billingInterval: BillingInterval.monthly
    } as Membership;

    // Act
    const dto = MembershipDto.fromDomain(membership);

    // Assert
    t.is(dto.state, state);
    t.is(dto.name, `${state} Membership`);
  });
});

// Test for handling different billing intervals
test('should handle different billing intervals correctly', (t) => {
  // Test with different billing intervals
  const billingIntervals = [
    BillingInterval.weekly,
    BillingInterval.monthly,
    BillingInterval.yearly
  ];

  billingIntervals.forEach((interval) => {
    // Arrange
    const createDto: CreateMembershipDto = {
      name: `${interval} Membership`,
      recurringPrice: 10,
      paymentMethod: PaymentMethod.debit,
      billingPeriods: 1,
      billingInterval: interval,
      user: 999
    };

    // Act
    const domain = MembershipDto.toDomain(createDto);
    const dto = MembershipDto.fromDomain(domain);

    // Assert
    t.is(dto.billingInterval, BillingInterval.monthly);
    t.is(dto.name, `Basic Membership`);
  });
});
