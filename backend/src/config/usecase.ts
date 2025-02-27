export interface useCase<Type> {
  execute: (input: Type) => Promise<void>;
}