import { RouterTestingHarness } from "@angular/router/testing";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { StudentAssignmentComponent } from "./student-assignment.component";
import { AuthenticationService } from "../../services/authentication.service";
import { HttpHeaders, provideHttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

describe('StudentAssignmentComponent', () => {
  let component: StudentAssignmentComponent;
  let harness: RouterTestingHarness;
  // let httpTesting: HttpTestingController;

  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  const USER_ID = 'user';
  const TOKEN = 'token';

  // const API_URL = environment.API_URL;

  beforeEach(async () => {
    authenticationService = jasmine.createSpyObj('AuthenticationService', ['retrieveUserId', 'retrieveAuthenticationHeaders']);
    authenticationService.retrieveUserId.and.returnValue(USER_ID);
    authenticationService.retrieveAuthenticationHeaders.and.returnValue({
      headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', `Bearer ${TOKEN}`)
    });

    TestBed.configureTestingModule({
      imports: [StudentAssignmentComponent],
      providers: [
        provideRouter([{ path: '**', component: StudentAssignmentComponent }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    // httpTesting = TestBed.inject(HttpTestingController);
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', StudentAssignmentComponent);

    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  })
  
});
