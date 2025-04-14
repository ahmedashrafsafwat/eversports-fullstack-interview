import { Membership } from '../../../domain/membership/membership.model';
import IMembershipRepository from '../../interfaces/repositories/IMembershipRepository';

export class InMemoryMembershipRepository implements IMembershipRepository {
  private memberships: Membership[] = [];
  private nextId = 1;

  async findAll(): Promise<Membership[]> {
    return [...this.memberships];
  }

  async create(membership: Membership): Promise<Membership> {
    // Create a new instance with the assigned ID
    const newMembership = Membership.create({
      ...(membership.toJSON() as any),
      id: this.nextId++
    });

    this.memberships.push(newMembership);
    return newMembership;
  }
}
