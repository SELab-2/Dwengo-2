import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassChartComponent, ClassGraphComponent } from './class-graph.component';
import { NgApexchartsModule } from 'ng-apexcharts';

describe('ClassChartComponent', () => {
    let fixture: ComponentFixture<ClassChartComponent>;
    let component: ClassChartComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgApexchartsModule, ClassChartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ClassChartComponent);
        component = fixture.componentInstance;

        // Provide mock data to the component
        const mockClassChartData: ClassGraphComponent[] = [
            new ClassGraphComponent('Math Class', 85),
            new ClassGraphComponent('Science Class', 78),
            new ClassGraphComponent('History Class', 92),
        ];
        component.classChartData = mockClassChartData;

        // Trigger change detection
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the bar chart options correctly', () => {
        expect(component.barChartOptions.series).toEqual([
            {
                name: $localize`:@@progress:Average Score`,
                data: [85, 78, 92],
            },
        ]);
        expect(component.barChartOptions.xaxis?.categories).toEqual([
            'Math Class',
            'Science Class',
            'History Class',
        ]);
    });

    it('should generate the correct x-axis labels', () => {
        const xAxisLabels = component.barChartOptions.xaxis?.categories;
        expect(xAxisLabels).toEqual(['Math Class', 'Science Class', 'History Class']);
    });
});