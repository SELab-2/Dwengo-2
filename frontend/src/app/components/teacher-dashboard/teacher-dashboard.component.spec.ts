import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

import { TeacherDashboardComponent } from "./teacher-dashboard.component";
import { ClassOverviewWidgetComponent } from "../small-components/class-overview-widget/class-overview-widget.component";
import { DeadlinesWidgetComponent } from "../small-components/upcoming-deadlines-widget/deadlines-widget.component";

describe('TeacherDashboardComponent', () => {
    let component: TeacherDashboardComponent;
    let harness: RouterTestingHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [TeacherDashboardComponent],
            providers: [
                provideRouter([
                    { path: "", component: TeacherDashboardComponent },
                    { path: "classes", component: ClassOverviewWidgetComponent },
                    { path: "deadlines", component: DeadlinesWidgetComponent },
                ]),
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });

        harness = await RouterTestingHarness.create();
        component = await harness.navigateByUrl("/", TeacherDashboardComponent);
        harness.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have "classes" as the default selected view', () => {
        expect(component.selectedView).toBe('classes');
    });

    it('should update selectedView when a menu card is clicked', async () => {
        const menuCards = harness.fixture.nativeElement.querySelectorAll('app-menu-card');
        spyOn(component, 'setView');

        menuCards[1].click();

        harness.detectChanges();
        harness.fixture.whenStable().then(() => {
            expect(component.setView).toHaveBeenCalledWith('deadlines');
            expect(component.selectedView).toBe('deadlines');
        });
    });


    it('should navigate correctly when menu card is clicked', async () => {
        const menuCards = harness.fixture.nativeElement.querySelectorAll('app-menu-card');

        menuCards[1].click();
        await harness.navigateByUrl('/deadlines', DeadlinesWidgetComponent);
        harness.detectChanges();

        const deadlinesWidget = harness.fixture.nativeElement.querySelector('app-deadlines-widget');
        expect(deadlinesWidget).toBeTruthy();
    });

    it('should show the correct widget based on selectedView', () => {
        component.setView('classes');
        harness.detectChanges();
        expect(harness.fixture.nativeElement.querySelector('app-class-overview-widget')).toBeTruthy();
        expect(harness.fixture.nativeElement.querySelector('app-deadlines-widget')).toBeFalsy();

        component.setView('deadlines');
        harness.detectChanges();
        expect(harness.fixture.nativeElement.querySelector('app-class-overview-widget')).toBeFalsy();
        expect(harness.fixture.nativeElement.querySelector('app-deadlines-widget')).toBeTruthy();
    });
});
