export interface useCase<Type, ReturnType> {
  execute: (input: Type) => Promise<ReturnType>;
}