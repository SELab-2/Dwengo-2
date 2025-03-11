
export interface ServiceParams {
  //TODO can we abstract the fromObject method in services to for a Params as abstracted class or interface?
  // fromObject: (repository: any) => Promise<any>;
  // toObject: () => object;
}

//TODO if application layer always asks for an object in return to we need to specify ReturnType?
export interface Service<T extends ServiceParams> {
  execute: (input: T) => Promise<object>;
}

//TODO can we abstract the params type in services to for a Params as abstracted class or interface?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Services = Record<string, any>;