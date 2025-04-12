import { HttpClient } from '@angular/common/http';
import { AssignmentService } from './assignment.service';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';

describe('AssignmentService', () => {
  let http: jasmine.SpyObj<HttpClient>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let errorService: jasmine.SpyObj<ErrorService>;
  
  let service: AssignmentService;

  beforeEach(() => {
    // Setup the HTTP client
    http = jasmine.createSpyObj('HttpClient', ['get']);
    
    // Setup the AuthenticationService
    authenticationService = jasmine.createSpyObj('AuthenticationService', ['retrieveUserId', 'retrieveAuthenticationHeaders']);

    // Setup
    errorService = jasmine.createSpyObj('ErrorService', ['pipeHandler']);
    
    service = new AssignmentService(
      http, authenticationService, errorService
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  
});
