import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { TeacherDashboardService } from '../../services/getClasses.service';
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
  ApexGrid,
  ApexTitleSubtitle
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

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule, MatIconModule, NgApexchartsModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.less'],
  providers: [TeacherDashboardService]
})
export class TeacherDashboardComponent {
  id: string = "test";
  learningPathsLink: string = '/teacher/learning-paths';
  createClassLink: string = '/teacher/classes/new/select';

  selectedView: string | null = null;

  // This is all mock data, awaiting some API functionality after refactor
  classes = ["Class 1", "Class 2", "Class 3"];
  deadlines = ["Math Exam - 03/30", "History Essay - 04/02", "Science Report - 04/05"];
  questions = [
    { assignment: "Math Homework", question: "What is Pythagoras' theorem?" },
    { assignment: "Science Project", question: "How do you calculate force?" }
  ];

  public barChartOptions: Partial<BarChartOptions>;
  public lineChartOptions: Partial<LineChartOptions>;

  constructor(private dashboardService: TeacherDashboardService) {
    // Again, this is mock data. 
    this.barChartOptions = {
      series: [
        {
          name: "Assignment Progress",
          data: [76, 85, 99, 98, 87]
        },
        {
          name: "Finished students",
          data: [44, 55, 57, 56, 61]
        }
      ],
      chart: {
        type: "bar",
        height: 350
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
        categories: [
          "Maths",
          "Physics",
          "Biology",
          "STEM",
          "Literature"
        ]
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "%";
          }
        }
      }
    };

    this.lineChartOptions = {
      series: [
        {
          name: "Maths",
          data: [10, 41, 35, 51, 49, 62, 69, 73, 86]
        },
        {
          name: "Physics",
          data: [5, 8, 12, 16, 28, 35, 43, 48, 54]
        },
        {
          name: "STEM",
          data: [15, 35, 42, 51, 58, 64, 72, 81, 95]
        }
      ],
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
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep"
        ]
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


  setView(view: string) {
    this.selectedView = this.selectedView === view ? null : view;
  }
}
