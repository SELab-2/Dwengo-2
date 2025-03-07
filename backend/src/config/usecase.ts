export interface UseCase<Type, ReturnType> {
  execute: (input: Type) => Promise<ReturnType>;
}

export interface UseCaseParams<Type>{
  fromObject: (input: Object) => Type,
  toObject: (input: Type) => Object
}