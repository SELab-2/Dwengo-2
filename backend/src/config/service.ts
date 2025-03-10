//TODO if application layer always asks for an object in return to we need to specify ReturnType?
export interface Service<Type, ReturnType> {
  execute: (input: Type) => Promise<ReturnType>;
}

export interface ServiceParams {
  //TODO can we abstract the fromObject method in services to for a Params as abstracted class or interface?
  // fromObject: (repository: any) => Promise<any>;
  // toObject: () => object;
}

//TODO can we abstract the params type in services to for a Params as abstracted class or interface?
export type Services = Record<string, Service<any, any>>;