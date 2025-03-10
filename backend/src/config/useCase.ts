/**
 * UseCase interface
 * @param Type - input type
 * @param ReturnType - return type
 */
export interface UseCase<Type, ReturnType> {
  execute: (input: Type) => Promise<ReturnType>;
}
