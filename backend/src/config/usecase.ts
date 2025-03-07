export interface UseCase<Type, ReturnType> {
  execute: (input: Type) => Promise<ReturnType>;
}

export interface UseCaseParams<Type>{
  toObject: (input: Type) => Object
}