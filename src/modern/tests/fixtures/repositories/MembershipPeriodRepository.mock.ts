import { MembershipPeriod } from '../../../domain/membership/membershipPeriod/membershipPeriod.model';
import IMembershipPeriodRepository from '../../../infrastructure/interfaces/repositories/IMembershipPeriodRepository';

class MockMembershipPeriodRepository implements IMembershipPeriodRepository {
  periods: MembershipPeriod[] = [];
  nextId = 1;

  async findAll(): Promise<MembershipPeriod[]> {
    return this.periods;
  }

  async findById(id: number): Promise<MembershipPeriod | null> {
    return this.periods.find((p) => p.id === id) || null;
  }

  async findByMembershipId(membershipId: number): Promise<MembershipPeriod[]> {
    return this.periods.filter((p) => p.membershipId === membershipId);
  }

  async createMany(periods: MembershipPeriod[]): Promise<MembershipPeriod[]> {
    const createdPeriods: MembershipPeriod[] = [];
    for (const period of periods) {
      const created = await this.create(period);
      createdPeriods.push(created);
    }
    return createdPeriods;
  }

  async create(period: MembershipPeriod): Promise<MembershipPeriod> {
    const newPeriod = MembershipPeriod.create({
      ...(period.toJSON() as any),
      id: this.nextId++
    });
    this.periods.push(newPeriod);
    return newPeriod;
  }

  async update(period: MembershipPeriod): Promise<MembershipPeriod> {
    const index = this.periods.findIndex((p) => p.id === period.id);
    if (index === -1) throw new Error('Membership period not found');
    this.periods[index] = period;
    return period;
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.periods.length;
    this.periods = this.periods.filter((p) => p.id !== id);
    return this.periods.length !== initialLength;
  }
}
