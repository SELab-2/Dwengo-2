import { Entity } from "../core/entities/entityInterface";

export interface ServiceParams {
  //TODO can we abstract the fromObject method in services to for a Params as abstracted class or interface?
  // fromObject: (repository: any) => Promise<any>;
  // toObject: () => object;
}

//TODO if application layer always asks for an object in return to we need to specify ReturnType?
export interface Service<T extends ServiceParams, ReturnType> {
  execute: (input: T) => Promise<ReturnType>;
}

//TODO can we abstract the params type in services to for a Params as abstracted class or interface?
export type Services = Record<string, any>;