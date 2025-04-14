import {
  BillingInterval,
  components,
  PaymentMethod
} from '../../../../../core/types/apiGenerated.interface';

export class CreateMembershipCommand {
  constructor(
    public readonly name: components['schemas']['MembershipInput']['name'],
    public readonly recurringPrice: components['schemas']['MembershipInput']['recurringPrice'],
    public readonly paymentMethod: PaymentMethod,
    public readonly billingPeriods: components['schemas']['MembershipInput']['billingPeriods'],
    public readonly billingInterval: BillingInterval,
    public readonly validFrom: Date,
    public readonly user: components['schemas']['Membership']['user']
  ) {}
}
