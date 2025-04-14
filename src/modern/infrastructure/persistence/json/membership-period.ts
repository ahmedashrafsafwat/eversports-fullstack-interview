import {
  MembershipPeriod,
  MembershipPeriodId
} from '../../../domain/membershipPeriod/membershipPeriod.model';
import type { MembershipId } from '../../../domain/membership/membership.model';
import IMembershipPeriodRepository from '../../../infrastructure/interfaces/repositories/IMembershipPeriodRepository';

export class InMemoryMembershipPeriodRepository
  implements IMembershipPeriodRepository
{
  private periods: MembershipPeriod[] = [];
  private nextId = 1;

  async findByMembershipId(
    membershipId: MembershipId
  ): Promise<MembershipPeriod[]> {
    return this.periods.filter((p) => p.membershipId === membershipId);
  }

  async createMany(periods: MembershipPeriod[]): Promise<MembershipPeriod[]> {
    const createdPeriods: MembershipPeriod[] = [];

    for (const period of periods) {
      const newPeriod = await this.create(period);
      createdPeriods.push(newPeriod);
    }

    return createdPeriods;
  }

  async create(period: MembershipPeriod): Promise<MembershipPeriod> {
    // Create a new instance with the assigned ID
    const newPeriod = MembershipPeriod.create({
      ...(period.toJSON() as any),
      id: this.nextId++
    });

    this.periods.push(newPeriod);
    return newPeriod;
  }
}
