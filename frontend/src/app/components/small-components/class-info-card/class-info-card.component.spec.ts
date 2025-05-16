import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassInfoCardComponent } from './class-info-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('ClassInfoCardComponent', () => {
    let fixture: ComponentFixture<ClassInfoCardComponent>;
    let component: ClassInfoCardComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatCardModule,
                MatListModule,
                MatIconModule,
                MatProgressSpinnerModule,
                RouterTestingModule,
                ClassInfoCardComponent,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ClassInfoCardComponent);
        component = fixture.componentInstance;

        // Provide inputs to the component
        component.className = 'Math Class';
        component.studentCount = 30;
        component.assignmentCount = 5;
        component.targetGroup = 'Grade 10';
        component.completionPercentage = 50;
        component.classId = '123';
        component.loadingData = false;
        // Trigger change detection
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the correct class name', () => {
        const titleElement = fixture.debugElement.query(By.css('mat-card-title'));
        expect(titleElement.nativeElement.textContent.trim()).toBe('Math Class');
    });

    it('should display the correct student count', () => {
        const studentElement = fixture.debugElement.query(By.css('mat-list-item:nth-child(1) span'));
        expect(studentElement.nativeElement.textContent.trim()).toBe('groupsStudents: 30');
    });

    it('should display the correct assignment count', () => {
        const assignmentElement = fixture.debugElement.query(By.css('mat-list-item:nth-child(2) span'));
        expect(assignmentElement.nativeElement.textContent.trim()).toBe('assignment5');
    });

    it('should display the correct target group', () => {
        const targetGroupElement = fixture.debugElement.query(By.css('mat-list-item:nth-child(3) span'));
        expect(targetGroupElement.nativeElement.textContent.trim()).toBe('schoolGrade 10');
    });

    it('should apply the correct progress color class', () => {
        const progressSpinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
        expect(progressSpinner.nativeElement.classList).toContain('progress-orange');
    });

    it('should generate the correct router link', () => {
        const cardElement = fixture.debugElement.query(By.css('mat-card'));
        expect(cardElement.attributes['ng-reflect-router-link']).toBe('/teacher/classes/123');
    });
});