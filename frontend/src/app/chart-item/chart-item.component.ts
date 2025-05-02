import { Component } from '@angular/core';
import { DepenseDueItemComponent } from '../depense-due-item/depense-due-item.component';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexTitleSubtitle,
  NgApexchartsModule
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
};

@Component({
  selector: 'app-chart-item',
  imports: [NgApexchartsModule],
  templateUrl: './chart-item.component.html',
  styleUrl: './chart-item.component.css'
})
export class ChartItemComponent {
  public chartOptions: ChartOptions;
  
  constructor() {
    this.chartOptions = {
      series: [10, 20, 30, 40],
      chart: {
      type: 'pie',
      height: 450,
      width: 450,
      },
      labels: ['Arthur', 'Hugo', 'Léa', 'Laura'],
      dataLabels: {
      enabled: false
      },
      legend: {
      show: true,
      position: 'right',
      offsetY: 70,
      offsetX: 0,
      fontSize: '20px',
      fontWeight: 'bold',
      }
    };
  }
}
