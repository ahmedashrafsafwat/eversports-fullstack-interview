import { Membership } from './membership.model';
import IMembershipRepository from '../../infrastructure/interfaces/repositories/IMembershipRepository';
import IMembershipPeriodRepository from '../../infrastructure/interfaces/repositories/IMembershipPeriodRepository';
import {
  CreateMembershipDto,
  MembershipDto
} from '../../application/dto/membership.dto';
import {
  MembershipWithPeriodDto,
  MembershipWithPeriodsDto
} from '../../application/dto/membershipWithPeriod.dto';
import { MembershipPeriod } from './membershipPeriod/membershipPeriod.model';
import { logMethod } from '../../core/decorators/logMethod';

export class MembershipService {
  constructor(
    private readonly membershipRepository: IMembershipRepository,
    private readonly membershipPeriodRepository: IMembershipPeriodRepository
  ) {}

  @logMethod()
  async createMembership(
    dto: CreateMembershipDto
  ): Promise<MembershipWithPeriodsDto> {
    // Create the membership domain object
    const membershipDomain = MembershipDto.toDomain(dto);

    const membership = Membership.create(membershipDomain);

    // Save the membership
    const savedMembership = await this.membershipRepository.create(membership);

    // Generate and save the periods
    const periods = await savedMembership.generatePeriods();
    const savedPeriods =
      await this.membershipPeriodRepository.createMany(periods);

    // Return the response DTO
    return MembershipWithPeriodDto.fromDomain(savedMembership, savedPeriods);
  }

  @logMethod()
  async getAllMemberships(): Promise<MembershipWithPeriodsDto[]> {
    const memberships = await this.membershipRepository.findAll();
    const periods: MembershipPeriod[] = [];
    for (const membership of memberships) {
      periods.push(
        ...(await this.membershipPeriodRepository.findByMembershipId(
          membership.id
        ))
      );
    }

    return MembershipWithPeriodDto.fromDomainList(memberships, periods);
  }
}
