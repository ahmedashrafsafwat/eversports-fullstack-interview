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

let originalMembershipCreate: typeof Membership.create;

test.before(() => {
  originalMembershipCreate = Membership.create;

  Membership.create = sinon.stub().callsFake((props) => {
    const now = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(now.getFullYear() + 1);

    return mockMembership1;
  });
});

test.after(() => {
  Membership.create = originalMembershipCreate;
});

test('should correctly convert from DTO to domain and back to DTO', (t) => {
  const createDto: CreateMembershipDto = {
    name: 'Integration Test Membership',
    recurringPrice: 129.99,
    paymentMethod: PaymentMethod.credit,
    billingPeriods: 6,
    billingInterval: BillingInterval.monthly,
    user: 123
  };

  const domainModel = MembershipDto.toDomain(createDto);

  const responseDto = MembershipDto.fromDomain(domainModel);

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

test('should convert multiple domain models to DTOs correctly', (t) => {
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

  const dtos = MembershipDto.fromDomainList(mockMemberships);

  t.is(dtos.length, 2);

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

test('should handle all membership states correctly', (t) => {
  const membershipStates = [
    MembershipState.active,
    MembershipState.expired,
    MembershipState.pending
  ];

  membershipStates.forEach((state) => {
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

    const dto = MembershipDto.fromDomain(membership);

    t.is(dto.state, state);
    t.is(dto.name, `${state} Membership`);
  });
});

test('should handle different billing intervals correctly', (t) => {
  const billingIntervals = [
    BillingInterval.weekly,
    BillingInterval.monthly,
    BillingInterval.yearly
  ];

  billingIntervals.forEach((interval) => {
    const createDto: CreateMembershipDto = {
      name: `${interval} Membership`,
      recurringPrice: 10,
      paymentMethod: PaymentMethod.debit,
      billingPeriods: 1,
      billingInterval: interval,
      user: 999
    };

    const domain = MembershipDto.toDomain(createDto);
    const dto = MembershipDto.fromDomain(domain);

    t.is(dto.billingInterval, BillingInterval.monthly);
    t.is(dto.name, `Basic Membership`);
  });
});
