import test from 'ava';
import { MembershipService } from '../../domain/membership/membership.service';
import { InMemoryMembershipRepository } from '../../infrastructure/persistence/json/membership';
import { InMemoryMembershipPeriodRepository } from '../../infrastructure/persistence/json/membership-period';
import { CreateMembershipDto } from '../../application/dto/membership.dto';
import {
  createMembershipdto,
  createMembershipPerioddto
} from '../fixtures/membership.fixtures';
import { Membership } from '../../domain/membership/membership.model';
import { MembershipPeriod } from '../../domain/membershipPeriod/membershipPeriod.model';

// Test database setup
let membershipRepo: InMemoryMembershipRepository;
let periodRepo: InMemoryMembershipPeriodRepository;
let membershipService: MembershipService;

// Runs before each test for isolation, this would be emptying the tables before each test
test.beforeEach(async () => {
  // Initialize in-memory repositories
  // Initialize real new Membeship service

  membershipRepo = new InMemoryMembershipRepository();
  periodRepo = new InMemoryMembershipPeriodRepository();
  membershipService = new MembershipService(membershipRepo, periodRepo);
});

// --- Integration Tests ---

test('createMembership() creates membership and generates periods', async (t) => {
  const dto: CreateMembershipDto = createMembershipdto;

  // Act
  const result = await membershipService.createMembership(dto);

  // Assert: Verify returned DTO
  t.is(result.membership.name, 'Basic Membership');
  t.is(result.membershipPeriods.length, 12); // Should generate 12 periods (12 months)
});

test('getAllMemberships() returns memberships with periods', async (t) => {
  // Arrange: Manually insert test data
  const membership = Membership.create(createMembershipdto);
  const membershipPeriod = MembershipPeriod.create(createMembershipPerioddto);

  await membershipRepo.create(membership);
  await periodRepo.create(membershipPeriod);

  // Act
  const result = await membershipService.getAllMemberships();

  // Assert
  t.is(result.length, 1);
  t.is(result[0].membership.name, 'Basic Membership');
  t.is(result[0].membershipPeriods.length, 1);
});

test('getAllMemberships() returns empty array if no memberships exist', async (t) => {
  // Act
  const result = await membershipService.getAllMemberships();

  // Assert
  t.is(result.length, 0);
});
