import { Request, Response, NextFunction } from 'express';
import { BadRequestError, InternalServerError } from '../errors/apiError';
import {
  ErrorResponseMessage,
  BillingInterval,
  PaymentMethod,
  components
} from '../types/apiGenerated.interface';

type ErrorMessage = NonNullable<
  components['schemas']['ErrorResponse']['message']
>;

type SubscriptionRequest = Partial<{
  name: string;
  recurringPrice: number;
  paymentMethod: PaymentMethod;
  billingInterval: BillingInterval;
  billingPeriods: number;
}>;

const createRule = <T>(
  predicate: (data: T) => boolean,
  errorCode: ErrorMessage
) => {
  return (data: T): ErrorMessage | null =>
    !predicate(data) ? errorCode : null;
};

// Validation rules for subscriptions
const subscriptionRules = [
  // Mandatory fields
  createRule<SubscriptionRequest>(
    (data) => Boolean(data.name) && typeof data.recurringPrice === 'number',
    ErrorResponseMessage.missingMandatoryFields
  ),

  // Price must be non-negative
  createRule<SubscriptionRequest>(
    (data) =>
      !(typeof data.recurringPrice === 'number' && data.recurringPrice < 0),
    ErrorResponseMessage.negativeRecurringPrice
  ),

  // Cash payments cannot exceed 100
  createRule<SubscriptionRequest>(
    (data) =>
      !(
        data.paymentMethod === 'cash' &&
        typeof data.recurringPrice === 'number' &&
        data.recurringPrice > 100
      ),
    ErrorResponseMessage.cashPriceBelow100
  ),

  // We need this custom function for complex billing interval rules
  (data: SubscriptionRequest): ErrorMessage | null => {
    const { billingInterval, billingPeriods } = data;

    switch (billingInterval) {
      case 'monthly':
        if (typeof billingPeriods === 'number') {
          if (billingPeriods > 12)
            return ErrorResponseMessage.billingPeriodsMoreThan12Months;
          if (billingPeriods < 6)
            return ErrorResponseMessage.billingPeriodsLessThan6Months;
        }
        break;
      case 'yearly':
        if (typeof billingPeriods === 'number') {
          if (billingPeriods > 10)
            return ErrorResponseMessage.billingPeriodsMoreThan10Years;
          if (billingPeriods < 3)
            return ErrorResponseMessage.billingPeriodsLessThan3Years;
        }
        break;
      default:
        if (billingInterval !== undefined)
          return ErrorResponseMessage.invalidBillingPeriods;
    }
    return null;
  }
];

export const createValidationMiddleware = <T>(
  rules: Array<(data: T) => ErrorMessage | null>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req.body as T;

      for (const rule of rules) {
        const errorMessage = rule(data);
        if (errorMessage) {
          throw new BadRequestError(errorMessage);
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Create subscription validator middleware
export const subscriptionValidator =
  createValidationMiddleware<SubscriptionRequest>(subscriptionRules);
