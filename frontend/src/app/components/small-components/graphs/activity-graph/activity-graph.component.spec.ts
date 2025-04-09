import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityChartComponent, ActivityChartData } from './activity-graph.component';
import { NgApexchartsModule } from 'ng-apexcharts';

describe('ActivityChartComponent', () => {
    let fixture: ComponentFixture<ActivityChartComponent>;
    let component: ActivityChartComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgApexchartsModule, ActivityChartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ActivityChartComponent);
        component = fixture.componentInstance;

        // Provide mock data to the component
        const mockActivityData: ActivityChartData[] = [
            new ActivityChartData('Math Class', [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]),
            new ActivityChartData('Science Class', [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115]),
        ];
        component.activityChartData = mockActivityData;

        // Trigger change detection
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the chart options correctly', () => {
        expect(component.lineChartOptions.series).toEqual([
            { name: 'Math Class', data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120] },
            { name: 'Science Class', data: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115] },
        ]);
        expect(component.lineChartOptions.xaxis?.categories).toEqual(
            component.getLast12Months().map((month) => month.substring(0, 3))
        );
    });


    it('should generate the correct x-axis labels for the last 12 months', () => {
        const last12Months = component.getLast12Months();
        expect(last12Months.length).toBe(12);
        expect(last12Months).toContain($localize`:@@month_Jan:Jan`); // Example check for localization
    });
});