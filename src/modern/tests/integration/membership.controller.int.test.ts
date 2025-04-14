import test from 'ava';
import express from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';
import { MembershipController } from '../../domain/membership/membership.controller';
import { CreateMembershipHandler } from '../../application/use-cases/membership/commands/create-membership/create-membership.handler';
import { GetAllMembershipsHandler } from '../../application/use-cases/membership/commands/get-all-memberships/get-all-memberships.handler';
import { TYPES } from '../../core/types/types.interface';
import { CreateMembershipCommand } from '../../application/use-cases/membership/commands/create-membership/create-membership.command';
import {
  createMembershipdto,
  createValidMembershipInput,
  missingNameInValidMembershipInput
} from '../fixtures/membership.fixtures';
import {
  mockMembershipsWithPeriodsArr,
  mockMembershipWithPeriods
} from '../fixtures/membershipWithPeriods.fixtures';
import { MembershipWithPeriodsDto } from '../../application/dto/membershipWithPeriod.dto';
import sinon from 'sinon';
import { Container } from '../../infrastructure/di/container';

// Mock handlers
let container: Container;
test.beforeEach(() => {
  container = Container.getInstance();

  // Setup mock handlers with correct return types
  const mockCreateHandler = sinon.createStubInstance(CreateMembershipHandler);
  mockCreateHandler.handle.resolves(mockMembershipWithPeriods);

  const mockGetAllHandler = sinon.createStubInstance(GetAllMembershipsHandler);
  mockGetAllHandler.handle.resolves(mockMembershipsWithPeriodsArr);

  container.register(TYPES.CreateMembershipHandler, mockCreateHandler);
  container.register(TYPES.GetAllMembershipsHandler, mockGetAllHandler);

  const controller = new MembershipController(
    mockCreateHandler as unknown as CreateMembershipHandler,
    mockGetAllHandler as unknown as GetAllMembershipsHandler
  );
  container.register(TYPES.MembershipController, controller);
});

function createTestApp() {
  const app = express();
  app.use(bodyParser.json());

  const controller = container.get<MembershipController>(
    TYPES.MembershipController
  );

  app.post('/memberships', controller.createMembership.bind(controller));
  app.get('/memberships', controller.getAllMemberships.bind(controller));

  return app;
}

test('POST /memberships creates membership successfully', async (t) => {
  const app = createTestApp();
  // Useless assignment only done for ACT in AAA test pattern
  const payload = createValidMembershipInput;

  const response = await request(app)
    .post('/memberships')
    .send(payload)
    .expect(201);

  console.log(response.body);
  t.is(
    response.body.membership.name,
    mockMembershipWithPeriods.membership.name
  );
  t.is(
    response.body.membership.billingInterval,
    mockMembershipWithPeriods.membership.billingInterval
  );
  t.is(
    response.body.membership.billingInterval,
    mockMembershipWithPeriods.membership.billingInterval
  );
  t.is(response.body.membershipPeriods.length, 1);
});

test('GET /memberships returns all memberships', async (t) => {
  const app = createTestApp();
  const response = await request(app).get('/memberships').expect(200);

  t.is(response.body.length, 2);
  t.is(response.body[0].membershipPeriods.length, 2);
});
