import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AssignmentPageComponent } from './assignment-page.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentService } from '../../services/assignment.service';
import { ProgressService } from '../../services/progress.service';
import { of } from 'rxjs';
import { Assignment } from '../../interfaces/assignment';
import { Progress } from '../../interfaces/progress/Progress';

// Mock data voor Assignment en Progress
const mockAssignment: Assignment = {
  id: 'test-assignment-id',
  classId: 'test-class-id',
  startDate: new Date(),
  deadline: new Date(),
  extraInstructions: 'Test extra instructions',
  name: 'Test Assignment',
  learningPathId: 'test-learning-path-id',
  className: 'Test Class'
};

const mockProgress: Progress = {
  id: 'test-progress-id',
  studentId: 'test-student-id',
  assignmentId: 'test-assignment-id',
  learningObjectId: 'test-learning-object-id',
  step: 1,
  maxStep: 5,
  time: new Date().toISOString()
};

describe('AssignmentPageComponent', () => {
  let component: AssignmentPageComponent;
  let fixture: ComponentFixture<AssignmentPageComponent>;
  let assignmentService: jasmine.SpyObj<AssignmentService>;
  let progressService: jasmine.SpyObj<ProgressService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Spies for services
    assignmentService = jasmine.createSpyObj('AssignmentService', ['retrieveAssignmentById']);
    progressService = jasmine.createSpyObj('ProgressService', ['getUserAssignmentProgress']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [AssignmentPageComponent],
      providers: [
        { provide: AssignmentService, useValue: assignmentService },
        { provide: ProgressService, useValue: progressService },
        { provide: MatSnackBar, useValue: snackBar },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'test-assignment-id', // Mocking assignment ID in URL
              },
            },
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentPageComponent);
    component = fixture.componentInstance;

    // Mock the services' return values
    assignmentService.retrieveAssignmentById.and.returnValue(of(mockAssignment));
    progressService.getUserAssignmentProgress.and.returnValue(of(mockProgress));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve and set assignment details correctly', () => {
    component.isStudent = true;
    component.ngOnInit();

    // Verifying if the assignment was set correctly
    expect(component.assignmentId).toBe('test-assignment-id');
    expect(component.learningPathId).toBe(mockAssignment.learningPathId);
    expect(component.assignment).toEqual(mockAssignment);
  });

  it('should retrieve progress and set step and maxStep correctly', () => {
    component.isStudent = true;
    fixture.detectChanges();
    component.ngOnInit();

    fixture.detectChanges();

    // Verifying if progress was retrieved and set
    expect(component.progress).toEqual(mockProgress);
    expect(component.step).toBe(mockProgress.step);
    expect(component.maxStep).toBe(mockProgress.maxStep);
    expect(component.loading).toBeFalse();
  });

  it('should update step when a submission is created', () => {
    const initialStep = component.step;

    // Triggering onSubmissionCreated
    component.onSubmissionCreated();

    // Verifying that step increases correctly
    expect(component.step).toBe(initialStep + 1);
  });
});
