import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubmissionComponent } from './create-submission.component';

describe('CreateSubmissionComponent', () => {
  let component: CreateSubmissionComponent;
  let fixture: ComponentFixture<CreateSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
