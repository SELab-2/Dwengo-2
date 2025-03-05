export interface UseCase<Type, ReturnType> {
  execute: (input: Type) => Promise<ReturnType>;
}