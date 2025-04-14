import test from 'ava';
import sinon from 'sinon';
import { MembershipService } from '../../domain/membership/membership.service';
import { Membership } from '../../domain/membership/membership.model';
import { MembershipPeriod } from '../../domain/membershipPeriod/membershipPeriod.model';
import { CreateMembershipDto } from '../../application/dto/membership.dto';
import {
  BillingInterval,
  PaymentMethod
} from '../../core/types/apiGenerated.interface';
import {
  createMembershipdto,
  mockMembership1,
  period1,
  period2,
  period3
} from '../fixtures/membership.fixtures';

// Mock repositories
const mockMembershipRepo = {
  create: sinon.stub(),
  findAll: sinon.stub()
};

const mockPeriodRepo = {
  createMany: sinon.stub(),
  findByMembershipId: sinon.stub()
};

const membershipService = new MembershipService(
  mockMembershipRepo as any,
  mockPeriodRepo as any
);

test.beforeEach(() => {
  sinon.resetHistory();
});

test.after.always(() => {
  sinon.restore();
});

test('createMembership() creates membership and periods successfully', async (t) => {
  const mockMembership = Membership.create(mockMembership1);
  const mockPeriods = [new MembershipPeriod(period1)];

  mockMembershipRepo.create.resolves(mockMembership);
  mockPeriodRepo.createMany.resolves(mockPeriods);
  sinon.stub(mockMembership, 'generatePeriods').returns(mockPeriods);

  // Act
  const result = await membershipService.createMembership(createMembershipdto);

  // Assert
  t.true(mockMembershipRepo.create.calledOnce);
  t.true(mockPeriodRepo.createMany.calledWith(mockPeriods));
  t.is(result.membership.name, createMembershipdto.name);
  t.is(result.membershipPeriods.length, mockPeriods.length);
});

test('createMembership() throws when repository fails', async (t) => {
  mockMembershipRepo.create.rejects(new Error('DB Error'));

  await t.throwsAsync(
    () => membershipService.createMembership(createMembershipdto),
    {
      instanceOf: Error,
      message: 'DB Error'
    }
  );
});

test('getAllMemberships() returns memberships with periods', async (t) => {
  // Arrange
  const mockMemberships = [Membership.create(mockMembership1)];

  const mockPeriods = [
    MembershipPeriod.create(period1),
    MembershipPeriod.create(period2)
  ];

  mockMembershipRepo.findAll.resolves(mockMemberships);
  mockPeriodRepo.findByMembershipId.onFirstCall().resolves(mockPeriods);

  // Act
  const result = await membershipService.getAllMemberships();

  // Assert
  t.true(mockMembershipRepo.findAll.calledOnce);
  t.is(mockPeriodRepo.findByMembershipId.callCount, 1);
  t.is(result.length, 1);
  t.is(result[0].membershipPeriods.length, 2);
});

test('getAllMemberships() returns empty array when no memberships exist', async (t) => {
  // Arrange
  mockMembershipRepo.findAll.resolves([]);

  // Act
  const result = await membershipService.getAllMemberships();

  // Assert
  t.true(mockMembershipRepo.findAll.calledOnce);
  t.false(mockPeriodRepo.findByMembershipId.called);
  t.is(result.length, 0);
});
