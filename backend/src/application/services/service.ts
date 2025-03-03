// TODO - Add error handler
// TODO - Replace unknown when abstract type is defined for usecases
/**
 * Service is an abstract class defining the base structure of all service implementations.
 * Services provide a clean interface between controllers and use cases, encapsulating
 * business logic execution while allowing for composition of use cases.
 *
 * Each service implementation should focus on a single responsibility, with its
 * use cases injected through the constructor for testability.
 *
 * @template ServiceOutput The type returned by the service's execute method
 */
export abstract class Service<ServiceOutput = void> {
  protected usecases: Record<string, unknown>;

  public constructor(usecases: Record<string, unknown>) {
    this.usecases = usecases;
  }

  /**
   * Executes the service's primary function with the provided arguments.
   * Each service implementation defines its own parameter signature.
   *
   * @param args Arguments required by the specific service implementation
   * @returns Result of type ServiceOutput as defined by the implementing class
   */
  public abstract execute(...args: unknown[]): ServiceOutput;
}

export type Services = Record<string, Service<unknown>>;
