import IMembershipPeriodRepository from '../../../infrastructure/interfaces/repositories/IMembershipPeriodRepository';
import IMembershipRepository from '../../../infrastructure/interfaces/repositories/IMembershipRepository';
import {
  CreateMembershipPeriodDto,
  MembershipPeriodDto,
  MembershipPeriodResponseDto
} from '../../../application/dto/membershipPeriod.dto';
import { logMethod } from '../../../core/decorators/logMethod';

export class MembershipPeriodService {
  constructor(
    private readonly membershipPeriodRepository: IMembershipPeriodRepository
  ) {}

  @logMethod()
  async createMembershipPeriod(
    dto: CreateMembershipPeriodDto
  ): Promise<MembershipPeriodResponseDto> {
    const membershipPeriod = MembershipPeriodDto.toDomain(dto);

    const savedMembershipPeriod =
      await this.membershipPeriodRepository.create(membershipPeriod);

    return MembershipPeriodDto.fromDomain(savedMembershipPeriod);
  }

  @logMethod()
  async getMembershipPeriodsByMembershipId(
    membershipId: number
  ): Promise<MembershipPeriodResponseDto[]> {
    const membershipPeriods =
      await this.membershipPeriodRepository.findByMembershipId(membershipId);
    return MembershipPeriodDto.fromDomainList(membershipPeriods);
  }

  @logMethod()
  async createManyMembershipPeriods(
    dtos: CreateMembershipPeriodDto[]
  ): Promise<MembershipPeriodResponseDto[]> {
    const membershipPeriods = dtos.map((dto) =>
      MembershipPeriodDto.toDomain(dto)
    );

    const savedPeriods =
      await this.membershipPeriodRepository.createMany(membershipPeriods);

    return MembershipPeriodDto.fromDomainList(savedPeriods);
  }
}
