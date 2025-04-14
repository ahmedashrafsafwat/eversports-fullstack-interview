export const TYPES = {
  // Repositories
  MembershipService: Symbol.for('MembershipService'),
  MembershipPeriodService: Symbol.for('MembershipPeriodService'),

  // Command Handlers
  CreateMembershipHandler: Symbol.for('CreateMembershipHandler'),
  GetAllMembershipsHandler: Symbol.for('GetAllMembershipsHandler'),

  // Controllers
  MembershipController: Symbol.for('MembershipController'),
  MembershiPeriodpController: Symbol.for('MembershipPeriodController'),

  // Repositories
  MembershipRepository: Symbol.for('MembershipRepository'),
  MembershipPeriodRepository: Symbol.for('MembershipPeriodRepository'),

  // Services
  LoggingService: Symbol.for('LoggingService'),
  DateService: Symbol.for('DateService'),

  // Other infrastructure
  DatabaseConnection: Symbol.for('DatabaseConnection'),
  ConfigService: Symbol.for('ConfigService')
};
