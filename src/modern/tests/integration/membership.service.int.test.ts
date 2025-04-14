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
import { MembershipPeriod } from '../../domain/membership/membershipPeriod/membershipPeriod.model';

let membershipRepo: InMemoryMembershipRepository;
let periodRepo: InMemoryMembershipPeriodRepository;
let membershipService: MembershipService;

test.beforeEach(async () => {
  // Initialize in-memory repositories
  // Initialize real new Membeship service

  membershipRepo = new InMemoryMembershipRepository();
  periodRepo = new InMemoryMembershipPeriodRepository();
  membershipService = new MembershipService(membershipRepo, periodRepo);
});

test('createMembership() creates membership and generates periods', async (t) => {
  const dto: CreateMembershipDto = createMembershipdto;

  const result = await membershipService.createMembership(dto);

  t.is(result.membership.name, 'Basic Membership');
  t.is(result.membershipPeriods.length, 12); // Should generate 12 periods (12 months)
});

test('getAllMemberships() returns memberships with periods', async (t) => {
  const membership = Membership.create(createMembershipdto);
  const membershipPeriod = MembershipPeriod.create(createMembershipPerioddto);

  await membershipRepo.create(membership);
  await periodRepo.create(membershipPeriod);

  const result = await membershipService.getAllMemberships();

  t.is(result.length, 1);
  t.is(result[0].membership.name, 'Basic Membership');
  t.is(result[0].membershipPeriods.length, 1);
});

test('getAllMemberships() returns empty array if no memberships exist', async (t) => {
  const result = await membershipService.getAllMemberships();

  t.is(result.length, 0);
});
