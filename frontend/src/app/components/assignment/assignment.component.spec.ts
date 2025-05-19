import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AssignmentComponent } from './assignment.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentService } from '../../services/assignment.service';
import { ProgressService } from '../../services/progress.service';
import { of } from 'rxjs';
import { Assignment } from '../../interfaces/assignment';
import { Progress } from '../../interfaces/progress/progress';
import { TaskService } from '../../services/task.service';

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
  let component: AssignmentComponent;
  let fixture: ComponentFixture<AssignmentComponent>;
  let assignmentService: jasmine.SpyObj<AssignmentService>;
  let progressService: jasmine.SpyObj<ProgressService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let taskService: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    // Spies for services
    assignmentService = jasmine.createSpyObj('AssignmentService', ['retrieveAssignmentById']);
    progressService = jasmine.createSpyObj('ProgressService', ['getUserAssignmentProgress']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    taskService = jasmine.createSpyObj('TaskService', ['goToNextNode']);


    await TestBed.configureTestingModule({
      imports: [AssignmentComponent],
      providers: [
        { provide: AssignmentService, useValue: assignmentService },
        { provide: ProgressService, useValue: progressService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: TaskService, useValue: taskService },
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

    fixture = TestBed.createComponent(AssignmentComponent);
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

    fixture = TestBed.createComponent(AssignmentComponent);
    component = fixture.componentInstance;
    component.assignmentId = 'test-assignment-id'; // <-- Set input before lifecycle starts



    fixture.detectChanges();

    // Verifying if the assignment was set correctly
    expect(component.assignmentId).toBe('test-assignment-id');
    expect(component.learningPathId).toBe(mockAssignment.learningPathId);
    expect(component.assignment).toEqual(mockAssignment);
  });

  it('should not directly update step when a submission is created, the learning path component will do this automatically', () => {
    const initialStep = component.step;
    component = fixture.componentInstance;

    // Triggering onSubmissionCreated
    component.onSubmissionCreated();

    // Verifying that step increases correctly
    expect(component.step).toBe(initialStep);
  });
});
