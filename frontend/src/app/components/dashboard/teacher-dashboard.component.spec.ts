import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherDashboardComponent } from './teacher-dashboard.component';
import { MenuCardComponent } from '../small-components/menu-card/menu-card.component';
import { ClassOverviewWidgetComponent } from '../small-components/class-overview-widget/class-overview-widget.component';
import { DeadlinesWidgetComponent } from '../small-components/upcoming-deadlines-widget/deadlines-widget.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('TeacherDashboardComponent', () => {
    let component: TeacherDashboardComponent;
    let fixture: ComponentFixture<TeacherDashboardComponent>;
    let router: Router;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                TeacherDashboardComponent,
                MenuCardComponent,
                ClassOverviewWidgetComponent,
                DeadlinesWidgetComponent,
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(TeacherDashboardComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        loader = TestbedHarnessEnvironment.loader(fixture);
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate correctly when menu card is clicked', async () => {
        spyOn(router, 'navigate');

        const menuCards = fixture.debugElement.queryAll(By.css('app-menu-card'));

        menuCards[1].triggerEventHandler('cardClick', null);
        fixture.detectChanges();

        expect(component.selectedView).toBe('deadlines');
        expect(router.navigate).not.toHaveBeenCalled();

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
