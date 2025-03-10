import { Request, Response } from "../types"
import { Services } from "../services/service";

/**
 * Controllers is an abstract class defining the base structure of a controller.
 * It is used to define the structure of a controller and will provide common functionality to all controllers.
 */
export abstract class Controller {
  public constructor(services: Services) {}

  /**
   * Handle the request.
   * Returns a Response object to send back the application
   */
  public abstract handle(req: Request): Response;
}
