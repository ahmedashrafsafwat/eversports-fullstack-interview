import { Membership } from '../../../domain/membership/membership.model';
import IMembershipRepository from '../../../infrastructure/interfaces/repositories/IMembershipRepository';

class MockMembershipRepository implements IMembershipRepository {
  memberships: Membership[] = [];
  nextId = 1;

  async findAll(): Promise<Membership[]> {
    return this.memberships;
  }

  async findById(id: number): Promise<Membership | null> {
    return this.memberships.find((m) => m.id === id) || null;
  }

  async findByUserId(user: number): Promise<Membership[]> {
    return this.memberships.filter((m) => m.user === user);
  }

  async create(membership: Membership): Promise<Membership> {
    const newMembership = Membership.create({
      ...(membership.toJSON() as any),
      id: this.nextId++
    });
    this.memberships.push(newMembership);
    return newMembership;
  }

  async update(membership: Membership): Promise<Membership> {
    const index = this.memberships.findIndex((m) => m.id === membership.id);
    if (index === -1) throw new Error('Membership not found');
    this.memberships[index] = membership;
    return membership;
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.memberships.length;
    this.memberships = this.memberships.filter((m) => m.id !== id);
    return this.memberships.length !== initialLength;
  }
}
