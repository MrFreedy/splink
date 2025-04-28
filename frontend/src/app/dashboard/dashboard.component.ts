import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { DepenseItemComponent } from '../depense-item/depense-item.component';
import { TaskItemComponent } from '../task-item/task-item.component';
import { IncomingTaskItemComponent } from '../incoming-task-item/incoming-task-item.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DepenseItemComponent, TaskItemComponent, IncomingTaskItemComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  username = null;
  depenses: any[] = [];

  constructor(private apiService: ApiService) {
    const user = localStorage.getItem('user');
    if (user) {
      this.username = JSON.parse(user).username;
    }
  }

  ngOnInit() {
    this.apiService.get('/depenses').subscribe((data: any) => {
      this.depenses = data;
      this.depenses.forEach(depense => {
        depense.date = new Date(depense.date).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      });
    }
    );
  }

  getIcon(category: string): string {
    switch (category) {
      case 'Courses':
        return 'icons/grocery/grocery-normal.png';
      case 'Loyer':
        return 'icons/loan/loan-normal.png';
      case 'Électricité':
        return 'icons/electricity/electricity-normal.png';
      case 'Covoiturage':
        return 'icons/covoiturage/covoiturage-normal.png';
      default:
        return 'icons/default.png';
    }
  }
  
  formatAmount(amount: number): string {
    return amount.toFixed(2).replace('.', ',') + '€';
  }
}
