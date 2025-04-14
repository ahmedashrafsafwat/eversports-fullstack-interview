// src/presentation/controllers/membershipPeriod.controller.ts
import { Request, Response } from 'express';
import { MembershipPeriodService } from './membershipPeriod.service';
import {
  CreateMembershipPeriodDto,
  MembershipPeriodResponseDto
} from '../../../application/dto/membershipPeriod.dto';
import { logMethod } from '../../../core/decorators/logMethod';

export class MembershipPeriodController {
  constructor(
    private readonly membershipPeriodService: MembershipPeriodService
  ) {}

  @logMethod()
  async createMembershipPeriod(
    dto: CreateMembershipPeriodDto
  ): Promise<MembershipPeriodResponseDto> {
    return this.membershipPeriodService.createMembershipPeriod(dto);
  }

  @logMethod()
  async getMembershipPeriodByIdMembershipPeriodId(
    membershipId: number
  ): Promise<MembershipPeriodResponseDto[]> {
    return this.membershipPeriodService.getMembershipPeriodsByMembershipId(
      membershipId
    );
  }

  @logMethod()
  async createManyMembershipPeriods(
    dtos: CreateMembershipPeriodDto[]
  ): Promise<MembershipPeriodResponseDto[] | void> {
    if (!Array.isArray(dtos) || dtos.length === 0) {
      return;
    }

    return this.membershipPeriodService.createManyMembershipPeriods(dtos);
  }
}
