import { Membership } from '../../../domain/membership/membership.model';

export default interface IMembershipRepository {
  findAll(): Promise<Membership[]>;
  create(membership: Membership): Promise<Membership>;
}
