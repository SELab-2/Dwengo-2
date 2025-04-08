import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassOverviewWidgetComponent } from './class-overview-widget.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Class } from '../../../interfaces/classes/class';

describe('ClassOverviewWidgetComponent', () => {
    let fixture: ComponentFixture<ClassOverviewWidgetComponent>;
    let component: ClassOverviewWidgetComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatCardModule,
                MatListModule,
                MatIconModule,
                RouterTestingModule,
                ClassOverviewWidgetComponent,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ClassOverviewWidgetComponent);
        component = fixture.componentInstance;

        // Provide mock data to the component
        const mockClasses: Class[] = [
            {
                id: '1',
                name: 'Math Class',
                description: 'A class about mathematics',
                targetAudience: 'Grade 10',
                teacherId: 'teacher1',
                assignments: [],
                studentCount: 30,
                completionPercentage: 75,
                submissionActivity: [1, 2, 3],
                averageScore: 85,
            },
            {
                id: '2',
                name: 'Science Class',
                description: 'A class about science',
                targetAudience: 'Grade 11',
                teacherId: 'teacher2',
                assignments: [],
                studentCount: 30,
                completionPercentage: 40,
                submissionActivity: [2, 3, 4],
                averageScore: 78,
            },
        ];
        component.classes = mockClasses;

        // Trigger change detection
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display the correct number of classes', () => {
        const classElements = fixture.debugElement.queryAll(By.css('app-class-info-card')); // Correct selector for child components
        expect(classElements.length).toBe(2);
    });

    it('should display the correct class names', () => {
        const classElements = fixture.debugElement.queryAll(By.css('app-class-info-card mat-card-title')); // Correct selector for class names
        expect(classElements[0].nativeElement.textContent.trim()).toBe('Math Class');
        expect(classElements[1].nativeElement.textContent.trim()).toBe('Science Class');
    });

    it('should display the correct student counts', () => {
        const studentElements = fixture.debugElement.queryAll(By.css('app-class-info-card mat-list-item:nth-child(1) span')); // Correct selector for student counts
        expect(studentElements[0].nativeElement.textContent.trim()).toBe('groupsStudents: 30');
        expect(studentElements[1].nativeElement.textContent.trim()).toBe('groupsStudents: 30');
    });

    it('should display the correct completion percentages', () => {
        const completionElements = fixture.debugElement.queryAll(By.css('app-class-info-card mat-progress-spinner')); // Correct selector for completion percentages
        expect(completionElements[0].nativeElement.classList).toContain('progress-green');
        expect(completionElements[1].nativeElement.classList).toContain('progress-orange');
    });

});