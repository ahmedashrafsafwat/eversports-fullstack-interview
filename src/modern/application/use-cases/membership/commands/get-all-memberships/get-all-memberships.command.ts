export class GetAllMembershipsCommand {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly sortBy?: string,
    public readonly sortOrder?: 'asc' | 'desc'
  ) {}
}
