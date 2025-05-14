import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CreateAssignmentComponent } from './create-assignment.component';
import { provideRouter } from '@angular/router';

describe('CreateAssignmentComponent', () => {
  let component: CreateAssignmentComponent;
  let fixture: ComponentFixture<CreateAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAssignmentComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
