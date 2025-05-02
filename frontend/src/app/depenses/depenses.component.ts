import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartItemComponent } from '../chart-item/chart-item.component';
import { ApiService } from '../services/api.service';
import { DettesItemComponent } from '../dettes-item/dettes-item.component';
import { AvoirsItemComponent } from '../avoirs-item/avoirs-item.component';

@Component({
  selector: 'app-depenses',
  imports: [CommonModule, ChartItemComponent, DettesItemComponent, AvoirsItemComponent],
  templateUrl: './depenses.component.html',
  styleUrl: './depenses.component.css'
})
export class DepensesComponent {
  user = JSON.parse(localStorage.getItem('user') || '{}');
  colocationId = this.user.colocation_id;
  userId = this.user._id;

  members: any[] = localStorage.getItem('colocation') ? JSON.parse(localStorage.getItem('colocation') || '{}').members : [];
  depenses: any[] = [];
  dettes: any[] = [];
  avoirs: any[] = [];

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.getDepenses();
    this.getDettes();
    this.getAvoirs();
  }

  getDepenses() {
    this.apiService.get(`/depenses`).subscribe((data: any) => {
      this.depenses = data;
      this.depenses.forEach(depense => {
        depense.paymentDate = new Date(depense.paymentDate).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        depense.paid_by = this.members.find((member: any) => member.user_id === depense.paid_by)?.username;
      });
    });
  }

  getDettes() {
    this.apiService.get(`/depenses/user/${this.userId}/dettes`).subscribe((data: any) => {
      this.dettes = data;
    });
  }

  getAvoirs() {
    this.apiService.get(`/depenses/user/${this.userId}/avoirs`).subscribe((data: any) => {
      this.avoirs = data;
    });
  }
}
