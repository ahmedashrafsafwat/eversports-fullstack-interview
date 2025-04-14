import test from 'ava';
import sinon from 'sinon';
import {
  MembershipDto,
  CreateMembershipDto,
  MembershipResponseDto
} from '../../application/dto/membership.dto';
import { Membership } from '../../domain/membership/membership.model';
import {
  BillingInterval,
  PaymentMethod
} from '../../core/types/apiGenerated.interface';
import { mockMembership1 } from '../fixtures/membership.fixtures';

// Setup for each test
test.beforeEach((t) => {
  // Setup context object to store test data
  t.context = {
    mockMembership: mockMembership1,
    createStub: sinon.stub(Membership, 'create').returns(mockMembership1)
  };
});

// Teardown after each test
test.afterEach((t) => {
  // Restore stubbed methods
  const { createStub } = t.context as { createStub: sinon.SinonStub };
  createStub.restore();
});

// Tests for fromDomain
test('fromDomain should convert a Membership domain model to MembershipResponseDto', (t) => {
  const { mockMembership } = t.context as { mockMembership: Membership };

  // Act
  const result = MembershipDto.fromDomain(mockMembership);

  // Assert
  t.deepEqual(result, {
    id: mockMembership.id,
    uuid: mockMembership.uuid,
    name: mockMembership.name,
    state: mockMembership.state,
    validFrom: mockMembership.validFrom,
    validUntil: mockMembership.validUntil,
    user: mockMembership.user,
    paymentMethod: mockMembership.paymentMethod,
    recurringPrice: mockMembership.recurringPrice,
    billingPeriods: mockMembership.billingPeriods,
    billingInterval: mockMembership.billingInterval
  });
});

test('fromDomain should handle null and undefined values correctly', (t) => {
  // Arrange
  const partialMembership = {
    name: 'Basic Membership',
    user: 789,
    paymentMethod: PaymentMethod.debit,
    recurringPrice: 49.99,
    billingPeriods: 6,
    billingInterval: BillingInterval.yearly
  } as Membership;

  // Act
  const result = MembershipDto.fromDomain(partialMembership);

  // Assert
  t.deepEqual(result, {
    id: undefined,
    uuid: undefined,
    name: 'Basic Membership',
    state: undefined,
    validFrom: undefined,
    validUntil: undefined,
    user: 789,
    paymentMethod: PaymentMethod.debit,
    recurringPrice: 49.99,
    billingPeriods: 6,
    billingInterval: BillingInterval.yearly
  });
});

// Tests for fromDomainList
test('fromDomainList should convert an array of Membership domain models to MembershipResponseDto array', (t) => {
  // Arrange
  const { mockMembership } = t.context as { mockMembership: Membership };

  const mockMemberships = [
    mockMembership,
    {
      ...mockMembership,
      id: 456,
      uuid: 'another-uuid',
      name: 'Standard Membership'
    } as Membership
  ];

  // Spy on fromDomain
  const fromDomainSpy = sinon.spy(MembershipDto, 'fromDomain');

  // Act
  const result = MembershipDto.fromDomainList(mockMemberships);

  // Assert
  t.is(result.length, 2);
  t.is(fromDomainSpy.callCount, 2);
  t.is(result[0].id, 1);
  t.is(result[1].id, 456);
  t.is(result[0].name, 'Basic Membership');
  t.is(result[1].name, 'Standard Membership');

  // Clean up
  fromDomainSpy.restore();
});

test('fromDomainList should return an empty array when given an empty array', (t) => {
  // Act
  const result = MembershipDto.fromDomainList([]);

  // Assert
  t.deepEqual(result, []);
});

// Tests for toDomain
test('toDomain should convert a CreateMembershipDto to a Membership domain model', (t) => {
  // Arrange
  const { mockMembership, createStub } = t.context as {
    mockMembership: Membership;
    createStub: sinon.SinonStub;
  };

  const createDto: CreateMembershipDto = {
    name: 'Gold Membership',
    recurringPrice: 199.99,
    paymentMethod: PaymentMethod.credit,
    billingPeriods: 1,
    billingInterval: BillingInterval.yearly,
    user: 789
  };

  // Act
  const result = MembershipDto.toDomain(createDto);

  // Assert
  t.true(
    createStub.calledWith({
      name: 'Gold Membership',
      recurringPrice: 199.99,
      paymentMethod: PaymentMethod.credit,
      billingPeriods: 1,
      billingInterval: BillingInterval.yearly,
      user: 789
    })
  );
  t.is(result, mockMembership);
});

test('toDomain should pass all properties from CreateMembershipDto to Membership.create', (t) => {
  // Arrange
  const { createStub } = t.context as { createStub: sinon.SinonStub };

  const createDto: CreateMembershipDto = {
    name: 'Silver Membership',
    recurringPrice: 149.99,
    paymentMethod: PaymentMethod.debit,
    billingPeriods: 4,
    billingInterval: BillingInterval.weekly,
    user: 321
  };

  // Act
  MembershipDto.toDomain(createDto);

  // Assert
  t.true(
    createStub.calledWith(
      sinon.match({
        name: createDto.name,
        recurringPrice: createDto.recurringPrice,
        paymentMethod: createDto.paymentMethod,
        billingPeriods: createDto.billingPeriods,
        billingInterval: createDto.billingInterval,
        user: createDto.user
      })
    )
  );
});
