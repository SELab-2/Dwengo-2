import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ClassesPageComponent } from './classes-page.component';
import { provideRouter } from '@angular/router';
import { ClassesService } from '../../services/classes.service';
import { By } from '@angular/platform-browser';
import { RouterTestingHarness } from '@angular/router/testing';

describe('ClassesPageComponent', () => {
  let component: ClassesPageComponent;
  let harness: RouterTestingHarness;

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

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/teacher/classes', ClassesPageComponent);

    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make an HTTP request': () => {
    // TODO
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

  it('should have atleast one class in the list', () => {
    const classes = harness.fixture.nativeElement.querySelectorAll('app-mini-class');
    expect(classes.length).toBeGreaterThan(0);
  });

});
