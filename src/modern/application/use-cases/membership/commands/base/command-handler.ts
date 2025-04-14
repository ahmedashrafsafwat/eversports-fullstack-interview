export interface CommandHandler<T, U> {
  handle(command: T): Promise<U>;
}
