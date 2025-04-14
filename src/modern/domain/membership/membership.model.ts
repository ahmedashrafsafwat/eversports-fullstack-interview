import { components } from '../../core/types/apiGenerated.interface';
import {
  MembershipState,
  PaymentMethod,
  BillingInterval,
  MembershipPeriodState
} from '../../core/types/apiGenerated.interface';
import { v4 as uuidv4 } from 'uuid';
import { MembershipPeriod } from '../membershipPeriod/membershipPeriod.model';
import { DateTime } from 'luxon';
import { logMethod } from '../../core/decorators/logMethod';

export type MembershipId = components['schemas']['Membership']['id'];
type MembershipUuid = components['schemas']['Membership']['uuid'];
type UserId = components['schemas']['Membership']['user'];

interface IMembershipProps {
  id?: MembershipId;
  uuid?: MembershipUuid;
  name: string;
  state?: MembershipState;
  validFrom?: Date;
  validUntil?: Date;
  user?: UserId;
  paymentMethod: PaymentMethod;
  recurringPrice: number;
  billingPeriods: number;
  billingInterval: BillingInterval;
}

export class Membership {
  private readonly _id: MembershipId;
  private readonly _uuid: MembershipUuid;
  private readonly _name: string;
  private _state: MembershipState;
  private readonly _validFrom: Date;
  private readonly _validUntil: Date;
  private readonly _user: UserId;
  private readonly _paymentMethod: PaymentMethod;
  private readonly _recurringPrice: number;
  private readonly _billingPeriods: number;
  private readonly _billingInterval: BillingInterval;

  constructor(props: IMembershipProps) {
    this._id = props.id ?? 0; // Will be set by repository
    this._uuid = props.uuid ?? uuidv4();
    this._name = props.name;
    this._validFrom = props.validFrom ?? new Date();
    this._user = props.user;
    this._paymentMethod = props.paymentMethod;
    this._recurringPrice = props.recurringPrice;
    this._billingPeriods = props.billingPeriods;
    this._billingInterval = props.billingInterval;

    // Calculate validUntil based on billing parameters
    this._validUntil =
      props.validUntil ??
      this.calculateValidUntil(
        this._validFrom,
        this._billingInterval,
        this._billingPeriods
      );

    // Determine state based on dates
    this._state = props.state ?? this.determineState();
  }

  private calculateValidUntil(
    validFrom: Date,
    billingInterval: BillingInterval,
    billingPeriods: number
  ): Date {
    let validUntil: DateTime;
    const validFromLuxon = DateTime.fromJSDate(validFrom, { zone: 'utc' });

    switch (billingInterval) {
      case BillingInterval.monthly:
        validUntil = validFromLuxon.plus({ months: billingPeriods });
        break;
      case BillingInterval.yearly:
        validUntil = validFromLuxon.plus({ years: billingPeriods });
        break;
      case BillingInterval.weekly:
        validUntil = validFromLuxon.plus({ weeks: billingPeriods });
        break;
    }

    return validUntil.toJSDate();
  }

  private determineState(): MembershipState {
    const now = new Date();

    if (this._validFrom > now) {
      return MembershipState.pending;
    }

    if (this._validUntil < now) {
      return MembershipState.expired;
    }

    return MembershipState.active;
  }

  // Generate periods for this membership
  public generatePeriods(): MembershipPeriod[] {
    const periods: MembershipPeriod[] = [];
    let periodStart = new Date(this._validFrom);

    for (let i = 0; i < this._billingPeriods; i++) {
      const start = new Date(periodStart);
      const end = this.calculateNextPeriodEnd(start, this._billingInterval);

      const period = MembershipPeriod.create({
        id: i + 1,
        membershipId: this._id,
        start,
        end,
        state: MembershipPeriodState.planned
      });

      periods.push(period);
      periodStart = new Date(end);
    }

    return periods;
  }

  private calculateNextPeriodEnd(
    start: Date,
    billingInterval: BillingInterval
  ): Date {
    const end = new Date(start);

    switch (billingInterval) {
      case BillingInterval.monthly:
        end.setMonth(start.getMonth() + 1);
        break;
      case BillingInterval.yearly:
        end.setMonth(start.getMonth() + 12);
        break;
      case BillingInterval.weekly:
        end.setDate(start.getDate() + 7);
        break;
    }

    return end;
  }

  // Getters
  get id(): MembershipId {
    return this._id;
  }

  get uuid(): MembershipUuid {
    return this._uuid;
  }

  get name(): string {
    return this._name;
  }

  get state(): MembershipState {
    return this._state;
  }

  get validFrom(): Date {
    return new Date(this._validFrom);
  }

  get validUntil(): Date {
    return new Date(this._validUntil);
  }

  get user(): UserId {
    return this._user;
  }

  get paymentMethod(): PaymentMethod {
    return this._paymentMethod;
  }

  get recurringPrice(): number {
    return this._recurringPrice;
  }

  get billingPeriods(): number {
    return this._billingPeriods;
  }

  get billingInterval(): BillingInterval {
    return this._billingInterval;
  }

  // Factory method
  public static create(props: IMembershipProps): Membership {
    return new Membership(props);
  }

  // To JSON for API responses
  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      uuid: this._uuid,
      name: this._name,
      state: this._state,
      validFrom: this._validFrom,
      validUntil: this._validUntil,
      user: this._user,
      paymentMethod: this._paymentMethod,
      recurringPrice: this._recurringPrice,
      billingPeriods: this._billingPeriods,
      billingInterval: this._billingInterval
    };
  }
}
