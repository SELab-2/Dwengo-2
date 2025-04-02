import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CreateClassComponent } from './create-class.component';
import { ClassesService } from '../../services/classes.service';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';

describe('CreateClassComponent', () => {
  let component: CreateClassComponent;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClassComponent],
      providers: [
        provideRouter([{ path: "**", component: CreateClassComponent }]),

        // https://angular.dev/guide/http/testing
        ClassesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', CreateClassComponent);
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a create class form', () => {
    const createClassForm = harness.fixture.nativeElement.querySelector('form');
    expect(createClassForm).toBeTruthy();
  });

  it('should have a class name input', () => {
    const classNameInput = harness.fixture.nativeElement.querySelector('input[id="name"]');
    expect(classNameInput).toBeTruthy();
  });

  it('should have a class description input', () => {
    const classDescriptionInput = harness.fixture.nativeElement.querySelector('textarea[id="description"]');
    expect(classDescriptionInput).toBeTruthy();
  });

  it('should have a class target audience input', () => {
    const classTargetAudienceInput = harness.fixture.nativeElement.querySelector('input[id="target-audience"]');
    expect(classTargetAudienceInput).toBeTruthy();
  });

  it('should have a create class button', () => {
    const createClassButton = harness.fixture.nativeElement.querySelector('button[type="submit"]');
    expect(createClassButton).toBeTruthy();
  });

});
