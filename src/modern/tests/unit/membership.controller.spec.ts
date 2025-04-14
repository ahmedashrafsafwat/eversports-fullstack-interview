import test from 'ava';
import sinon from 'sinon';
import { MembershipController } from '../../domain/membership/membership.controller';
import { CreateMembershipCommand } from '../../application/use-cases/membership/commands/create-membership/create-membership.command';
import { GetAllMembershipsCommand } from '../../application/use-cases/membership/commands/get-all-memberships/get-all-memberships.command';
import { CreateMembershipHandler } from '../../application/use-cases/membership/commands/create-membership/create-membership.handler';
import { GetAllMembershipsHandler } from '../../application/use-cases/membership/commands/get-all-memberships/get-all-memberships.handler';

test.beforeEach((t) => {
  // Create mock handlers
  const createMembershipHandler = {
    handle: sinon.stub()
  };

  const getAllMembershipsHandler = {
    handle: sinon.stub()
  };

  // Create controller with mocked dependencies
  const controller = new MembershipController(
    createMembershipHandler as unknown as CreateMembershipHandler,
    getAllMembershipsHandler as unknown as GetAllMembershipsHandler
  );

  // Create mock request and response objects
  const req = {
    body: {}
  };

  const res = {
    status: sinon.stub().returnsThis(),
    json: sinon.stub().returnsThis()
  };

  // Store in context for tests to use
  t.context = {
    controller,
    createMembershipHandler,
    getAllMembershipsHandler,
    req,
    res
  };
});

// Cleanup after each test
test.afterEach.always(() => {
  sinon.restore();
});

test('createMembership should create a membership and return 201 status', async (t) => {
  const { controller, createMembershipHandler, req, res } = t.context as any;

  req.body = {
    name: 'Premium Membership',
    recurringPrice: 19.99,
    paymentMethod: 'CREDIT_CARD',
    billingPeriods: 12,
    billingInterval: 'MONTHLY',
    validFrom: '2023-01-01'
  };

  const expectedResult = {
    id: 1,
    name: 'Premium Membership',
    user: 2000
  };

  createMembershipHandler.handle.resolves(expectedResult);

  await controller.createMembership(req, res);

  t.true(createMembershipHandler.handle.calledOnce);
  const actualCommand = createMembershipHandler.handle.firstCall.args[0];

  t.is(actualCommand.name, 'Premium Membership');
  t.is(actualCommand.recurringPrice, 19.99);
  t.is(actualCommand.paymentMethod, 'CREDIT_CARD');
  t.is(actualCommand.billingPeriods, 12);
  t.is(actualCommand.billingInterval, 'MONTHLY');
  t.true(actualCommand.validFrom instanceof Date);
  t.is(actualCommand.user, 2000);

  t.true(res.status.calledWith(201));
  t.true(res.json.calledWith(expectedResult));
});

test('createMembership should return 500 status when handler throws error', async (t) => {
  const { controller, createMembershipHandler, req, res } = t.context as any;

  req.body = {
    name: 'Premium Membership',
    recurringPrice: 19.99,
    paymentMethod: 'CREDIT_CARD',
    billingPeriods: 12,
    billingInterval: 'MONTHLY',
    validFrom: '2023-01-01'
  };

  // Setup handler mock to throw error
  const error = new Error('Database error');
  createMembershipHandler.handle.rejects(error);

  // Mock console.error to prevent test output pollution
  const consoleErrorStub = sinon.stub(console, 'error');

  await controller.createMembership(req, res);

  t.true(consoleErrorStub.calledOnce);
  t.true(consoleErrorStub.calledWith('Error creating membership:', error));

  t.true(res.status.calledWith(500));
  t.true(res.json.calledWith({ error: 'Failed to create membership' }));
});

test('getAllMemberships should return all memberships with 200 status', async (t) => {
  const { controller, getAllMembershipsHandler, req, res } = t.context as any;

  const expectedMemberships = [
    { id: 1, name: 'Basic Membership' },
    { id: 2, name: 'Premium Membership' }
  ];

  getAllMembershipsHandler.handle.resolves(expectedMemberships);

  await controller.getAllMemberships(req, res);

  t.true(getAllMembershipsHandler.handle.calledOnce);
  const actualCommand = getAllMembershipsHandler.handle.firstCall.args[0];
  t.true(actualCommand instanceof GetAllMembershipsCommand);

  t.true(res.status.calledWith(200));
  t.true(res.json.calledWith(expectedMemberships));
});

test('getAllMemberships should return 500 status when handler throws error', async (t) => {
  const { controller, getAllMembershipsHandler, req, res } = t.context as any;

  const error = new Error('Database error');
  getAllMembershipsHandler.handle.rejects(error);

  const consoleErrorStub = sinon.stub(console, 'error');

  await controller.getAllMemberships(req, res);

  t.true(consoleErrorStub.calledOnce);
  t.true(consoleErrorStub.calledWith('Error fetching memberships:', error));

  t.true(res.status.calledWith(500));
  t.true(res.json.calledWith({ error: 'Failed to fetch memberships' }));
});

test('createMembership should correctly convert validFrom to Date object', async (t) => {
  const { controller, createMembershipHandler, req, res } = t.context as any;

  req.body = {
    name: 'Test Membership',
    recurringPrice: 9.99,
    paymentMethod: 'DIRECT_DEBIT',
    billingPeriods: 6,
    billingInterval: 'BIMONTHLY',
    validFrom: '2023-06-15T12:00:00Z'
  };

  createMembershipHandler.handle.resolves({ id: 1 });

  await controller.createMembership(req, res);

  t.true(createMembershipHandler.handle.calledOnce);
  const actualCommand = createMembershipHandler.handle.firstCall.args[0];

  t.true(actualCommand.validFrom instanceof Date);
  t.is(
    actualCommand.validFrom.toISOString(),
    new Date(req.body.validFrom).toISOString()
  );
});
