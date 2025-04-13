import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  NgApexchartsModule,
} from "ng-apexcharts";

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

export class ClassGraphComponent {
  /**
   * Class to represent the chart data for ONE class:
   * @param _name the classname
   * @param _averageScore the average percentage (rounded) of completion for every assignment in this class
   * @param _finishedStudents the amount of students that finished all their assignments
   */
  constructor(
    private _name: string,
    private _averageScore: number) { }

  public get name(): string {
    return this._name;
  }
  public get averageScore(): number {
    return this._averageScore;
  }
}

@Component({
  selector: 'app-class-chart',
  standalone: true,
  imports: [CommonModule, MatIconModule, NgApexchartsModule, MatTooltipModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './class-graph.component.html',
  styleUrls: ['./class-graph.component.less']
})
export class ClassChartComponent implements OnInit {

  @Input() classChartData!: ClassGraphComponent[];
  @Input() displayContent!: boolean;

  selectedView: string | null = null;

  public barChartOptions: Partial<BarChartOptions> = {};
  ngOnInit(): void {
    this.initializeBarChart(this.classChartData);
  }

  private initializeBarChart(classChartData: ClassGraphComponent[]) {
    // Again, this is mock data. 
    this.barChartOptions = {
      series: [
        {
          name: $localize`:@@progress:Average Score`,
          data: classChartData.map(data => data.averageScore)
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        zoom: {
          enabled: false
        },
        redrawOnWindowResize: true
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: classChartData.map(data => data.name),
        max: 100,
        min: 0,
      },
      yaxis: {
        max: 100,
        forceNiceScale: true
      },
      fill: {
        opacity: 1
      },
    };
  }

}
