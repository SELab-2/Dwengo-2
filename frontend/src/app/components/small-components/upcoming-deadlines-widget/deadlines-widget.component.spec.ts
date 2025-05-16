import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeadlinesWidgetComponent } from './deadlines-widget.component';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';
import { Assignment } from '../../../interfaces/assignment';

describe('DeadlinesWidgetComponent', () => {
    let fixture: ComponentFixture<DeadlinesWidgetComponent>;
    let component: DeadlinesWidgetComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatCardModule,
                MatListModule,
                RouterTestingModule, // Added RouterTestingModule to provide ActivatedRoute
                DeadlinesWidgetComponent, // Import the standalone component
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DeadlinesWidgetComponent);
        component = fixture.componentInstance;

        // Provide mock data to the component
        component.assignments = [
            {
                name: 'Math Assignment',
                deadline: new Date('2025-04-10'),
                id: '1',
                className: 'Math Class',
            } as Assignment,
            {
                name: 'Science Project',
                deadline: new Date('2025-04-15'),
                id: '2',
                className: 'Science Class',
            } as Assignment,
        ];

        // Trigger change detection
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display the correct number of deadlines', () => {
        const deadlineElements = fixture.debugElement.queryAll(By.css('.deadline-item'));
        expect(deadlineElements.length).toBe(2);
    });

    it('should display the correct deadline names', () => {
        const deadlineTitles = fixture.debugElement.queryAll(By.css('.deadline-item mat-card-title'));
        expect(deadlineTitles[0].nativeElement.textContent.trim()).toBe('Math Assignment');
        expect(deadlineTitles[1].nativeElement.textContent.trim()).toBe('Science Project');
    });

    it('should display the correct due dates', () => {
        const deadlineContents = fixture.debugElement.queryAll(By.css('.deadline-item mat-card-content p:first-child'));
        expect(deadlineContents[0].nativeElement.textContent.trim()).toBe('Deadline: Apr 10, 2025');
        expect(deadlineContents[1].nativeElement.textContent.trim()).toBe('Deadline: Apr 15, 2025');
    });

    it('should display the correct class names', () => {
        const classContents = fixture.debugElement.queryAll(By.css('.deadline-item mat-card-content p:last-child'));
        expect(classContents[0].nativeElement.textContent.trim()).toBe('Class: Math Class');
        expect(classContents[1].nativeElement.textContent.trim()).toBe('Class: Science Class');
    });

    it('should generate the correct router links for each assignment', () => {
        const linkElements = fixture.debugElement.queryAll(By.css('.deadline-item'));
        expect(linkElements[0].attributes['ng-reflect-router-link']).toBe('/teacher/assignments/1');
        expect(linkElements[1].attributes['ng-reflect-router-link']).toBe('/teacher/assignments/2');
    });

    it('should handle an empty deadlines list gracefully', () => {
        component.assignments = [];
        fixture.detectChanges();

        const deadlineElements = fixture.debugElement.queryAll(By.css('.deadline-item'));
        expect(deadlineElements.length).toBe(0);

        const emptyMessage = fixture.debugElement.query(By.css('.deadline-list'));
        expect(emptyMessage).toBeTruthy();
        expect(emptyMessage.nativeElement.textContent.trim()).toBe('No deadlines (yet?)');
    });
});