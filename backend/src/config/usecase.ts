export interface UseCase<Type, ReturnType> {
  execute: (input: Type) => Promise<ReturnType>;
}

export interface UseCaseParams<Type>{
  fromObject: (input: object) => Type,
  toObject: (input: Type) => object
}