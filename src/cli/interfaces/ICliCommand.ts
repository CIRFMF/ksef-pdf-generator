export interface ICliCommand {
  execute(): Promise<void>;
}
