import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherDashboardComponent } from './teacher-dashboard.component';
import { MenuCardComponent } from '../small-components/menu-card/menu-card.component';
import { ClassOverviewWidgetComponent } from '../small-components/class-overview-widget/class-overview-widget.component';
import { DeadlinesWidgetComponent } from '../small-components/upcoming-deadlines-widget/deadlines-widget.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('TeacherDashboardComponent', () => {
    let component: TeacherDashboardComponent;
    let fixture: ComponentFixture<TeacherDashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule, // Provides ActivatedRoute and other routing services
                TeacherDashboardComponent,
                MenuCardComponent,
                ClassOverviewWidgetComponent,
                DeadlinesWidgetComponent,
            ],
            schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements like graphs
        }).compileComponents();

        fixture = TestBed.createComponent(TeacherDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should have "classes" as the default selected view', () => {
        expect(component.selectedView).toBe('classes');
    });

    it('should update selectedView when a menu card is clicked', () => {
        const menuCards = fixture.debugElement.queryAll(By.css('app-menu-card'));

        // Simulate a click on the deadlines card
        menuCards[1].triggerEventHandler('cardClick', null);
        fixture.detectChanges();

        expect(component.selectedView).toBe('deadlines');

        // Simulate a click on the questions card
        menuCards[2].triggerEventHandler('cardClick', null);
        fixture.detectChanges();

        expect(component.selectedView).toBe('questions');
    });

    it('should show the correct widget based on selectedView', () => {
        component.setView('classes');
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('app-class-overview-widget'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('app-deadlines-widget'))).toBeFalsy();

        component.setView('deadlines');
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('app-class-overview-widget'))).toBeFalsy();
        expect(fixture.debugElement.query(By.css('app-deadlines-widget'))).toBeTruthy();
    });
});