import { MembershipService } from '../../domain/membership/membership.service';
import IMembershipRepository from '../interfaces/repositories/IMembershipRepository';
import IMembershipPeriodRepository from '../interfaces/repositories/IMembershipPeriodRepository';
import { InMemoryMembershipRepository } from '../persistence/json/membership';
import { InMemoryMembershipPeriodRepository } from '../persistence/json/membership-period';
import { CreateMembershipHandler } from '../../application/use-cases/membership/commands/create-membership/create-membership.handler';
import { MembershipController } from '../../domain/membership/membership.controller';
import { GetAllMembershipsHandler } from '../../application/use-cases/membership/commands/get-all-memberships/get-all-memberships.handler';
import { TYPES } from '../../core/types/types.interface';

/**
 * Simple Dependency Injection container to manage application services
 */
export class Container {
  private static instance: Container;
  private services: Map<symbol, any> = new Map();

  private constructor() {
    // Register default implementations
    this.register(
      TYPES.MembershipRepository,
      new InMemoryMembershipRepository()
    );
    this.register(
      TYPES.MembershipPeriodRepository,
      new InMemoryMembershipPeriodRepository()
    );

    const membershipService = new MembershipService(
      this.get<IMembershipRepository>(TYPES.MembershipRepository),
      this.get<IMembershipPeriodRepository>(TYPES.MembershipPeriodRepository)
    );
    this.register(TYPES.MembershipService, membershipService);

    const createMembershipHandler = new CreateMembershipHandler(
      membershipService
    );
    this.register(TYPES.CreateMembershipHandler, createMembershipHandler);

    const getAllMembershipsHandler = new GetAllMembershipsHandler(
      membershipService
    );
    this.register(TYPES.GetAllMembershipsHandler, getAllMembershipsHandler);

    const membershipController = new MembershipController(
      createMembershipHandler,
      getAllMembershipsHandler
    );
    this.register(TYPES.MembershipController, membershipController);
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public register<T>(id: symbol, instance: T): void {
    this.services.set(id, instance);
  }

  public get<T>(id: symbol): T {
    const service = this.services.get(id);
    if (!service) {
      throw new Error(`Service ${id.toString} not registered in container`);
    }
    return service;
  }
}
