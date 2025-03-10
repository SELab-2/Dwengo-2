/**
 * Service is an abstract class defining the base structure of a service.
 * It is used to define the structure of a service and will provide common functionality to all services.
 * A service is meant to group together related use cases and provide a single point of access to them in the controllers.
 */
export abstract class Service {
  public constructor(usecases: object) {
    // TODO: add an object with generic use cases
  }

  /**
   * Execute the service.   * 
   * TODO: add more specific return type
   */
  public abstract execute(): void|object;
}

export type Services = Record<string, Service>;
