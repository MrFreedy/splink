import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
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
  imports: [NgApexchartsModule, FormsModule, CommonModule],
  templateUrl: './chart-item.component.html',
  styleUrl: './chart-item.component.css'
})
export class ChartItemComponent {
  public chartOptions: ChartOptions;
  selectedOption = 'option1';
  user = JSON.parse(localStorage.getItem('user') || '{}');
  colocationId = this.user.colocation_id;

  titleMap: any = {
    option1: 'Répartition globale par utilisateur',
    option2: 'Répartition globale par catégorie',
    option3: 'Répartition mensuelle par utilisateur',
    option4: 'Répartition mensuelle par catégorie'
  };

  ngOnInit() {
    this.onOptionChange();
  }

  constructor(private apiService: ApiService) {
    this.chartOptions = {
      series: [],
      chart: {
      type: 'pie',
      height: 450,
      width: 450,
      },
      labels: [],
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

  getGlobalRepartition() {
    this.apiService.get(`/depenses/colocation/${this.colocationId}/repartition`).subscribe((data => {
      const repartitionData = data as any[];
      this.chartOptions.series = repartitionData.map(item => item.pourcentage);
      this.chartOptions.labels = repartitionData.map(item => item.username);
    }));
  }

  getGlobalCategoryRepartition() {
    this.apiService.get(`/depenses/colocation/${this.colocationId}/repartition-par-categorie`).subscribe((data => {
      const repartitionData = data as any[];
      this.chartOptions.series = repartitionData.map(item => item.pourcentage);
      this.chartOptions.labels = repartitionData.map(item => item.category);
    }));
  }

  getMonthlyRepartition() {
    this.apiService.get(`/depenses/colocation/${this.colocationId}/repartition-mensuelle`).subscribe((data => {
      const repartitionData = data as any[];
      this.chartOptions.series = repartitionData.map(item => item.pourcentage);
      this.chartOptions.labels = repartitionData.map(item => item.username);
    }));
  }

  getMonthlyCategoryRepartition() {
    this.apiService.get(`/depenses/colocation/${this.colocationId}/repartition-par-categorie-mensuelle`).subscribe((data => {
      const repartitionData = data as any[];
      console.log(repartitionData);
      this.chartOptions.series = repartitionData.map(item => item.pourcentage);
      this.chartOptions.labels = repartitionData.map(item => item.category);
    }));
  }

  onOptionChange() {
    if (this.selectedOption === 'option1') {
      this.getGlobalRepartition();
    } else if (this.selectedOption === 'option2') {
      this.getGlobalCategoryRepartition();
    } else if (this.selectedOption === 'option3') {
      this.getMonthlyRepartition();
    } else if (this.selectedOption === 'option4') {
      this.getMonthlyCategoryRepartition();
    }
  }

  get title(): string {
    return this.titleMap[this.selectedOption] || 'Répartition';
  }
  
}
