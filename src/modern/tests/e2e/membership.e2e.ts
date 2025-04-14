import test from 'ava';
import request from 'supertest';
import app, { server } from '../../../';

import {
  MembershipCreationResponseSchema,
  MembershipPeriodSchema,
  MembershipSchema
} from '../helpers/membershipE2e';
import {
  billingIntervalInvalidInValidMembershipInput,
  billingIntervalMonthlyLessThan6InValidMembershipInput,
  billingIntervalMonthlyMoreThan12InValidMembershipInput,
  billingIntervalYearlyLessThan2InValidMembershipInput,
  billingIntervalYearlyMoreThan10InValidMembershipInput,
  createValidMembershipInput,
  missingNameInValidMembershipInput,
  recurringPriceLessThan100InValidMembershipInput,
  recurringPriceNegativeInValidMembershipInput,
  recurringPriceNotNumbereInValidMembershipInput
} from '../fixtures/membership.fixtures';
import { ErrorResponseMessage } from '../../core/types/apiGenerated.interface';

test('POST /memberships should create a new membership with 201 status', async (t) => {
  // This is a useless assignment, but it is here to apply the Arrange in the AAA pattern
  const payload = createValidMembershipInput;

  const response = await request(app)
    .post('/memberships')
    .send(payload)
    .expect(201);

  t.notThrows(() => MembershipCreationResponseSchema.parse(response.body));
});

test('POST /memberships should return 400 if body is empty', async (t) => {
  const invalidPayload = {};

  const response = await request(app)
    .post('/memberships')
    .send(invalidPayload)
    .expect(400);

  t.truthy(response.body.message);
  t.is(response.body.message, ErrorResponseMessage.missingMandatoryFields);
});

test('POST /memberships should return 400 if name is missing', async (t) => {
  const response = await request(app)
    .post('/memberships')
    .send(missingNameInValidMembershipInput)
    .expect(400);

  t.truthy(response.body.message);
  t.is(response.body.message, ErrorResponseMessage.missingMandatoryFields);
});

test('POST /memberships should return 400 if body is recurringPrice not a number', async (t) => {
  const response = await request(app)
    .post('/memberships')
    .send(recurringPriceNotNumbereInValidMembershipInput)
    .expect(400);

  t.truthy(response.body.message);
  t.is(response.body.message, ErrorResponseMessage.missingMandatoryFields);
});

test('POST /memberships should return 400 if recurringPrice is of negative value', async (t) => {
  const response = await request(app)
    .post('/memberships')
    .send(recurringPriceNegativeInValidMembershipInput)
    .expect(400);

  t.truthy(response.body.message);
  t.is(response.body.message, ErrorResponseMessage.negativeRecurringPrice);
});

test('POST /memberships should return 400 if recurringPrice is less than 100 and paymentMethod is cash', async (t) => {
  const response = await request(app)
    .post('/memberships')
    .send(recurringPriceLessThan100InValidMembershipInput)
    .expect(400);

  t.truthy(response.body.message);
  t.is(response.body.message, ErrorResponseMessage.cashPriceBelow100);
});

test('POST /memberships should return 400 if billingInterval is Mothly and billingPeriods is less than 6', async (t) => {
  const response = await request(app)
    .post('/memberships')
    .send(billingIntervalMonthlyLessThan6InValidMembershipInput)
    .expect(400);

  t.truthy(response.body.message);
  t.is(
    response.body.message,
    ErrorResponseMessage.billingPeriodsLessThan6Months
  );
});

test('POST /memberships should return 400 if billingInterval is Mothly and billingPeriods is more than 12', async (t) => {
  const response = await request(app)
    .post('/memberships')
    .send(billingIntervalMonthlyMoreThan12InValidMembershipInput)
    .expect(400);

  t.truthy(response.body.message);
  t.is(
    response.body.message,
    ErrorResponseMessage.billingPeriodsMoreThan12Months
  );
});

test('POST /memberships should return 400 if billingInterval is Yearly and billingPeriods is more than 10', async (t) => {
  const response = await request(app)
    .post('/memberships')
    .send(billingIntervalYearlyMoreThan10InValidMembershipInput)
    .expect(400);

  t.truthy(response.body.message);
  t.is(
    response.body.message,
    ErrorResponseMessage.billingPeriodsMoreThan10Years
  );
});

test('POST /memberships should return 400 if billingInterval is Yearly and billingPeriods is less than 2', async (t) => {
  const response = await request(app)
    .post('/memberships')
    .send(billingIntervalYearlyLessThan2InValidMembershipInput)
    .expect(400);

  t.truthy(response.body.message);
  t.is(
    response.body.message,
    ErrorResponseMessage.billingPeriodsLessThan3Years
  );
});

test('POST /memberships should return 400 if billingInterval is not Yearly or Monthly', async (t) => {
  const response = await request(app)
    .post('/memberships')
    .send(billingIntervalInvalidInValidMembershipInput)
    .expect(400);

  t.truthy(response.body.message);
  t.is(response.body.message, ErrorResponseMessage.invalidBillingPeriods);
});

test('GET /memberships should return a list of memberships with 200 status', async (t) => {
  const response = await request(app).get('/memberships').expect(200);

  t.true(Array.isArray(response.body), 'Response body should be an array');

  for (const item of response.body) {
    t.notThrows(() => MembershipSchema.parse(item.membership));
    for (const period of item.membershipPeriods) {
      t.notThrows(() => MembershipPeriodSchema.parse(period));
    }
  }
});

test.after.always('cleanup', async () => {
  await new Promise((resolve) => server.close(resolve));
});
