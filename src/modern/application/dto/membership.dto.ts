import {
  BillingInterval,
  components,
  PaymentMethod,
  MembershipState
} from '../../core/types/apiGenerated.interface';
import { Membership } from '../../domain/membership/membership.model';

type UserId = components['schemas']['Membership']['user'];
type MembershipId = components['schemas']['Membership']['id'];
type MembershipUuid = components['schemas']['Membership']['uuid'];
type paymentMethod = components['schemas']['PaymentMethod'];
export interface CreateMembershipDto {
  name: string;
  recurringPrice: number;
  paymentMethod: paymentMethod;
  billingPeriods: number;
  billingInterval: BillingInterval;
  user: UserId;
}

export interface MembershipResponseDto {
  id?: MembershipId;
  uuid?: MembershipUuid;
  name: string;
  state?: MembershipState;
  validFrom?: Date;
  validUntil?: Date;
  user: UserId;
  paymentMethod: PaymentMethod;
  recurringPrice: number;
  billingPeriods: number;
  billingInterval: BillingInterval;
}

export class MembershipDto {
  public static fromDomain(membership: Membership): MembershipResponseDto {
    return {
      id: membership.id,
      uuid: membership.uuid,
      name: membership.name,
      state: membership.state,
      validFrom: membership.validFrom,
      validUntil: membership.validUntil,
      user: membership.user,
      paymentMethod: membership.paymentMethod,
      recurringPrice: membership.recurringPrice,
      billingPeriods: membership.billingPeriods,
      billingInterval: membership.billingInterval
    };
  }

  public static fromDomainList(
    memberships: Membership[]
  ): MembershipResponseDto[] {
    return memberships.map((membership) => this.fromDomain(membership));
  }

  public static toDomain(dto: CreateMembershipDto): Membership {
    return Membership.create({
      name: dto.name,
      recurringPrice: dto.recurringPrice,
      paymentMethod: dto.paymentMethod,
      billingPeriods: dto.billingPeriods,
      billingInterval: dto.billingInterval,
      user: dto.user
    });
  }
}
