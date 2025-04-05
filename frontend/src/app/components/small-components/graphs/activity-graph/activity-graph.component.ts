import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component, Input, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexXAxis,
  ApexTooltip,
  NgApexchartsModule,
  ApexGrid,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
};

export class ActivityChartData {
  /**
   * Class to represent the chart data for ONE class:
   * @param _name the name of the class
   * @param _data a list of length 12 that has the number of submissions per month
   */
  constructor(private _name: string, private _data: number[]) {
    if (_data.length < 12) {
      this._data = (new Array(12 - _data.length)).fill(0).concat(_data)
    } else if (_data.length > 12) {
      this._data = _data.slice(-12)
    }

  }
  public get data(): number[] {
    return this._data;
  }
  public get name(): string {
    return this._name;
  }
}

@Component({
  selector: 'app-activity-chart',
  standalone: true,
  imports: [CommonModule, MatIconModule, NgApexchartsModule, MatCardModule, MatTooltipModule, MatProgressSpinnerModule],
  templateUrl: './activity-graph.component.html',
  styleUrls: ['./activity-graph.component.less']
})
export class ActivityChartComponent implements OnInit {

  @Input() activityChartData!: ActivityChartData[];

  selectedView: string | null = null;

  public lineChartOptions: Partial<LineChartOptions> = {};

  ngOnInit(): void {
    this.initializeBarChart(this.activityChartData);
  }

  public getLast12Months(): string[] {
    /**
     * @returns a list of the last 12 months, using loacl time. Last element is the last month.
     */

    // Since angular localize only supports static translation, it has to be done this way......
    const monthNames: string[] = [
      $localize`:@@month_Jan:Jan`,
      $localize`:@@month_Feb:Feb`,
      $localize`:@@month_Mar:Mar`,
      $localize`:@@month_Apr:Apr`,
      $localize`:@@month_May:May`,
      $localize`:@@month_Jun:Jun`,
      $localize`:@@month_Jul:Jul`,
      $localize`:@@month_Aug:Aug`,
      $localize`:@@month_Sep:Sep`,
      $localize`:@@month_Oct:Oct`,
      $localize`:@@month_Nov:Nov`,
      $localize`:@@month_Dec:Dec`
    ];
    const currentMonth: number = new Date().getMonth();

    return Array.from({ length: 12 }, (_, i) => monthNames[(currentMonth + i + 1) % 12]);
  }

  private initializeBarChart(lineChartData: ActivityChartData[]) {
    this.lineChartOptions = {
      series: lineChartData.map(activity => {
        return { name: activity.name, data: activity.data }
      }),
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        // Localization for every month tag: month_Jan: January etc
        categories: this.getLast12Months().map(m => m.substring(0, 3))
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " submissions (in total)";
          }
        }
      }
    };
  }

}
