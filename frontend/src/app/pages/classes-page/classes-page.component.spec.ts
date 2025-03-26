import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ClassesPageComponent } from './classes-page.component';
import { provideRouter } from '@angular/router';

describe('ClassesPageComponent', () => {
  let component: ClassesPageComponent;
  let fixture: ComponentFixture<ClassesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesPageComponent],
      providers: [
        provideRouter([]),

        // https://angular.dev/guide/http/testing
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
