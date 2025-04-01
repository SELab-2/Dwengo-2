import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ClassesPageComponent } from './classes-page.component';
import { provideRouter } from '@angular/router';
import { ClassesService } from '../../services/classes.service';
import { By } from '@angular/platform-browser';
import { RouterTestingHarness } from '@angular/router/testing';
import { environment } from '../../../environments/environment';


describe('ClassesPageComponent', () => {
  let component: ClassesPageComponent;
  let harness: RouterTestingHarness;
  let httpTesting: HttpTestingController;
  const API_URL = environment.API_URL
  const USER_ID = "219c1e2f-488a-4f94-a9d8-38b7c9bede1f";

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesPageComponent],
      providers: [
        provideRouter([
          {path: 'teacher/classes', component: ClassesPageComponent}
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
    component = await harness.navigateByUrl('/teacher/classes', ClassesPageComponent);

    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make an HTTP request', () => {
    // Check made request
    const req = httpTesting.expectOne(`${API_URL}/users/${USER_ID}/classes`);

    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTrue();
  });

  it('should have name filter input', () => {
    const input = harness.fixture.nativeElement.querySelector('input[id="nameFilterInput"]');
    expect(input).toBeTruthy();
  });

  it('should have create class button', () => {
    const button = harness.fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should have class list', () => {
    const list = harness.fixture.debugElement.query(By.css('#class-list'));
    expect(list).toBeTruthy();
  });
  // It's easier to test in an integration test that 'app-mini-class'es were made

});
