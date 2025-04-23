import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MiniAssignmentComponent } from './mini-assignment.component';
import { Assignment } from '../../interfaces/assignment/assignment';
import { By } from '@angular/platform-browser';

describe('MiniAssignmentComponent', () => {
  let component: MiniAssignmentComponent;
  let fixture: ComponentFixture<MiniAssignmentComponent>;
  let testAssignment: Assignment;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniAssignmentComponent],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MiniAssignmentComponent);
    component = fixture.componentInstance;

    // Define test assignment input
    testAssignment = {
      id: 'a1',
      classId: 'c1',
      startDate: new Date('2024-01-01'),
      deadline: new Date('2024-01-10'),
      extraInstructions: 'Read the book',
      name: 'Assignment 1',
      learningPathId: 'lp1',
      className: 'Math 101'
    };

    component._assignment = testAssignment;
    component._type = 'student';  // default
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an assignment input', () => {
    expect(component._assignment).toBeDefined();
    expect(component._assignment.name).toEqual('Assignment 1');
  });

  it('should display assignment name in mat-card-title', () => {
    const title = fixture.debugElement.query(By.css('#assignment-title'));
    expect(title.nativeElement.textContent).toContain('Assignment 1');
  });

  it('should display assignment class name', () => {
    const className = fixture.nativeElement.querySelector('#assignment-class');
    expect(className.textContent).toContain('Math 101');
  });

  it('should display assignment start date', () => {
    const startDate = fixture.nativeElement.querySelector('#assignment-startDate');
    expect(startDate.textContent).toContain('2024');  // Loose check
  });

  it('should display assignment deadline', () => {
    const deadline = fixture.nativeElement.querySelector('#assignment-deadline');
    expect(deadline.textContent).toContain('2024');  // Loose check
  });

  it('should render correct router link', () => {
    const card = fixture.debugElement.query(By.css('.mini-assignment'));
    const routerLink = card.attributes['ng-reflect-router-link'];
    expect(routerLink).toBe('/student/assignments/a1');
  });
});
