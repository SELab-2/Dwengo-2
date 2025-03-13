import { Controller } from './controllerExpress';
import { RouteHandlers } from '../types';
import * as UserServices from '../../core/services/user';
import { HttpMethod, Request } from '../types';
import { ServiceParams } from '../../config/service';
import { createParamsExtractor } from '../extractors';

const extractors = {
  register: createParamsExtractor(UserServices.CreateUserParams, {'_email': 'email', '_firstName': 'firstName', '_familyName': 'familyName', '_passwordHash': 'passwordHash', '_schoolName': 'schoolName', '_userType': 'userType'}, {}, []),
  login: createParamsExtractor(UserServices.GetUserParams, {'_id': 'id'}, {}, [])
}

/**
 * Controller responsible for authentication-related API endpoints including login and registration.
 * Follows RESTful patterns with paths:
 * - POST /login - Login a user
 * - POST /register - Register a new user
 */
export class AuthenticationController extends Controller {
  constructor(
    register: UserServices.CreateUser,
    login: UserServices.GetUser,
  ) {
    const handlers : RouteHandlers = {
      [HttpMethod.POST]: [
        { hasId: false, hasParentId: false, extractor: extractors.register,
          handler: (req: Request, data: ServiceParams) => this.create(req, data) },
        { hasId: false, hasParentId: false, extractor: extractors.login,
          handler: (req: Request, data: ServiceParams) => this.getOne(req, data) }
      ]
    };

    super({ register, login }, handlers);
  }
}
