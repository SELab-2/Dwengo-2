import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ClassComponent } from './class.component';
import { ClassesService } from '../../services/classes.service';
import { RouterTestingHarness } from '@angular/router/testing';
import { Class } from '../../interfaces/classes/class';
import { environment } from '../../../environments/environment';

describe('ClassComponent', () => {
  let component: ClassComponent;
  let harness: RouterTestingHarness;
  let httpTesting: HttpTestingController;
  const API_URL = environment.API_URL

  const testClass: Class = {
    name: "Economics",
    description: "Price go up, price go down",
    targetAudience: "Students",
    teacherId: "123",
    id: "4321"
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassComponent],
      providers: [
          provideRouter([
            {path: 'teacher/classes/:id', component: ClassComponent}
          ]),

          // https://angular.dev/guide/http/testing
          ClassesService,
          provideHttpClient(),
          provideHttpClientTesting()
      ]
    })
    .compileComponents();

    // Inject mock HTTP client
    httpTesting = TestBed.inject(HttpTestingController);

    // Create testing harness
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/teacher/classes/123', ClassComponent);

    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make a request to the API', async () => {
    // Check the made request
    const req = httpTesting.expectOne(`${API_URL}/classes/123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTrue();

    // Respond to the request
    req.flush(testClass);
  });

  it('should have a class name', () => {
    const name = harness.fixture.nativeElement.querySelector('input[id="name"]');
    expect(name).toBeDefined();
  });

  it('should have a class description', () => {
    const description = harness.fixture.nativeElement.querySelector('textarea[id="description"]');
    expect(description).toBeDefined();
  });

  it('should have a target audience', () => {
    const targetAudience = harness.fixture.nativeElement.querySelector('input[id="target-audience"]');
    expect(targetAudience).toBeDefined();
  });

});
