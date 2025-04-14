import test from 'ava';
import { MembershipPeriodService } from '../../domain/membership/membershipPeriod/membershipPeriod.service';
import { InMemoryMembershipPeriodRepository } from '../../infrastructure/persistence/json/membership-period';
import { InMemoryMembershipRepository } from '../../infrastructure/persistence/json/membership';
import {
  CreateMembershipPeriodDto,
  MembershipPeriodResponseDto
} from '../../application/dto/membershipPeriod.dto';
import {
  createMembershipdto,
  createMembershipPerioddto
} from '../fixtures/membership.fixtures';
import { Membership } from '../../domain/membership/membership.model';
import { MembershipPeriod } from '../../domain/membership/membershipPeriod/membershipPeriod.model';

let periodRepo: InMemoryMembershipPeriodRepository;
let membershipRepo: InMemoryMembershipRepository;
let periodService: MembershipPeriodService;

test.beforeEach(async () => {
  // Initialize fresh repositories for each test
  periodRepo = new InMemoryMembershipPeriodRepository();
  membershipRepo = new InMemoryMembershipRepository();
  periodService = new MembershipPeriodService(periodRepo);
});

test('createMembershipPeriod() creates a new period', async (t) => {
  const dto: CreateMembershipPeriodDto = createMembershipPerioddto;

  const result = await periodService.createMembershipPeriod(dto);

  t.is(result.membershipId, dto.membershipId);
  t.truthy(result.id);
  t.deepEqual(result.start, dto.start);
  t.deepEqual(result.end, dto.end);
});

test('getMembershipPeriodsByMembershipId() returns periods for membership', async (t) => {
  const membership = Membership.create(createMembershipdto);
  await membershipRepo.create(membership);

  const period = MembershipPeriod.create(createMembershipPerioddto);
  await periodRepo.create(period);

  const result = await periodService.getMembershipPeriodsByMembershipId(
    period.membershipId!
  );

  t.is(result.length, 1);
  t.is(result[0].membershipId, period.membershipId!);
});

test('getMembershipPeriodsByMembershipId() returns empty array if no periods exist', async (t) => {
  const result = await periodService.getMembershipPeriodsByMembershipId(999); // Non-existent ID

  t.is(result.length, 0);
});

test('createManyMembershipPeriods() creates multiple periods', async (t) => {
  const dtos: CreateMembershipPeriodDto[] = [
    {
      ...createMembershipPerioddto,
      start: new Date('2024-01-01'),
      end: new Date('2024-02-01')
    },
    {
      ...createMembershipPerioddto,
      start: new Date('2024-02-01'),
      end: new Date('2024-03-01')
    }
  ];

  const result = await periodService.createManyMembershipPeriods(dtos);

  t.is(result.length, 2);
  t.is(result[0].membershipId, dtos[0].membershipId);
  t.is(result[1].membershipId, dtos[1].membershipId);
});

test('createManyMembershipPeriods() returns empty array if input is empty', async (t) => {
  const result = await periodService.createManyMembershipPeriods([]);

  t.is(result.length, 0);
});

test('createMembershipPeriod() throws when repository fails', async (t) => {
  periodRepo.create = async () => {
    throw new Error('DB Error');
  };
  const dto: CreateMembershipPeriodDto = createMembershipPerioddto;

  await t.throwsAsync(() => periodService.createMembershipPeriod(dto), {
    instanceOf: Error,
    message: 'DB Error'
  });
});

test('createManyMembershipPeriods() throws when repository fails', async (t) => {
  periodRepo.createMany = async () => {
    throw new Error('Bulk Insert Failed');
  };
  const dtos: CreateMembershipPeriodDto[] = [
    createMembershipPerioddto,
    { ...createMembershipPerioddto, start: new Date('2024-02-01') }
  ];

  await t.throwsAsync(() => periodService.createManyMembershipPeriods(dtos), {
    instanceOf: Error,
    message: 'Bulk Insert Failed'
  });
});
