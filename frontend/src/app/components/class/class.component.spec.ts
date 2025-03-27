import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ClassComponent } from './class.component';
import { ClassesService } from '../../services/classes.service';
import { RouterTestingHarness } from '@angular/router/testing';
import { Class } from '../../interfaces/classes/class';

describe('ClassComponent', () => {
  let component: ClassComponent;
  let harness: RouterTestingHarness;
  const testClass: Class = {
    name: "Economics",
    description: "Price go up, price go down",
    targetAudience: "Students",
    teacherId: "123",
    classId: "4321"
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

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/teacher/classes/123', ClassComponent);

    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a class field', () => {
    expect(component._class).toBeDefined();
  });

  it('should make a request to the API', async () => {
    // Inject a mock HTTP client and service
    // const httpTesting = TestBed.inject(HttpTestingController);
    // const service = TestBed.inject(ClassesService);

    // Call the service
    // const _class$ = service.classWithId('123');

    // Subscribe to the observable which returns a promise
    // const _classPromise = firstValueFrom(_class$);

    // Check the made request
    // TODO
    // const req = httpTesting.expectOne('/api/classes');
    // expect(req.request.method).toBe('GET');

    // Respond to the request
    // req.flush(testClass);

    // Check the final result
    // expect(await _classPromise).toEqual(testClass);
  });

  it('should have a class name', () => {
    const name = harness.fixture.nativeElement.querySelector('h2');
    expect(name.textContent).toBe(testClass.name);
  });

  it('should have a class description', () => {
    const description = harness.fixture.nativeElement.querySelector('p[id="description"]');
    expect(description).toBeDefined();
  });

  it('should have a target audience', () => {
    const targetAudience = harness.fixture.nativeElement.querySelector('p[id="target-audience"]');
    expect(targetAudience).toBeDefined();
  });

});
