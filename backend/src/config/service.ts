export interface Service<Type, ReturnType> {
  execute: (input: Type) => Promise<ReturnType>;
}
