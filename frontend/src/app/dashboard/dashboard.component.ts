import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { DepenseItemComponent } from '../depense-item/depense-item.component';
import { TaskItemComponent } from '../task-item/task-item.component';
import { IncomingTaskItemComponent } from '../incoming-task-item/incoming-task-item.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DepenseItemComponent, TaskItemComponent, IncomingTaskItemComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user = JSON.parse(localStorage.getItem('user') || '{}');
  colocationId = this.user.colocation_id;

  username = null;
  depenses: any[] = [];
  depensesToSubmit: any = {
    title: '',
    amount: null,
    category: '',
    paymentDate: '',
    payer: ''
  };
  
  participants: { [key: string]: boolean } = {};
  participantNames: string[] = [];

  paymentDate: string = '';
  isModalOpen = false;

  constructor(private apiService: ApiService) {
    const user = localStorage.getItem('user');
    if (user) {
      this.username = JSON.parse(user).username;
    }
  }

  ngOnInit() {
    this.apiService.get(`/depenses/colocation/${this.colocationId}/last`).subscribe((data: any) => {
      this.depenses = data;
      this.depenses.forEach(depense => {
        depense.date = new Date(depense.date).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      });
    });

    this.apiService.get(`/colocations/${this.colocationId}/members`).subscribe((data: any) => {
      this.participants = data.reduce((acc: any, participant: any) => {
        acc[participant.user_id.username] = participant.isSelected || false;
        return acc;
      }, {});
      this.participantNames = Object.keys(this.participants);
    });
  }

  getIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'courses':
        return 'icons/grocery/grocery-normal.png';
      case 'loyer':
        return 'icons/loan/loan-normal.png';
      case 'électricité':
        return 'icons/electricity/electricity-normal.png';
      case 'covoiturage':
        return 'icons/covoiturage/covoiturage-normal.png';
      case 'convoiturage':
        return 'icons/covoiturage/covoiturage-normal.png';
      default:
        return 'icons/default.png';
    }
  }
  
  formatAmount(amount: number): string {
    return amount.toFixed(2).replace('.', ',') + '€';
  }

  openModal(){
    this.isModalOpen = true;
  }

  closeModal(){
    this.isModalOpen = false;
  }

  submitDepense() {
    if (!this.depensesToSubmit.title || !this.depensesToSubmit.amount || !this.depensesToSubmit.category || !this.depensesToSubmit.paymentDate || !this.depensesToSubmit.payer) {
      alert('Merci de remplir tous les champs.');
      return;
    }
  
    this.apiService.get(`/colocations/${this.colocationId}/members`).subscribe((members: any) => {
      const memberMap = members.reduce((acc: any, member: any) => {
        acc[member.user_id.username] = member.user_id._id;
        return acc;
      }, {});
  
      const paid_by_id = memberMap[this.depensesToSubmit.payer];
      const shared_between_ids = Object.keys(this.participants)
        .filter(name => this.participants[name])
        .map(name => memberMap[name]);
  
      const newDepense = {
        title: this.depensesToSubmit.title,
        amount: parseFloat(this.depensesToSubmit.amount),
        category: this.depensesToSubmit.category,
        paymentDate: new Date(this.depensesToSubmit.paymentDate),
        paid_by: paid_by_id,
        shared_between: shared_between_ids,
        colocation_id: this.colocationId,
        status: "à payer"
      };
  
      this.apiService.post('/depenses', newDepense).subscribe({
        next: (response) => {
          console.log('Dépense ajoutée', response);
          alert('Dépense ajoutée avec succès !');
          this.closeModal();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Erreur ajout dépense', err);
          alert('Erreur lors de l\'ajout de la dépense.');
        }
      });
    });
  }  
}
