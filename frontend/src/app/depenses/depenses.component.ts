import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartItemComponent } from '../chart-item/chart-item.component';
import { ApiService } from '../services/api.service';
import { DettesItemComponent } from '../dettes-item/dettes-item.component';
import { AvoirsItemComponent } from '../avoirs-item/avoirs-item.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-depenses',
  imports: [CommonModule, ChartItemComponent, DettesItemComponent, AvoirsItemComponent, FormsModule],
  templateUrl: './depenses.component.html',
  styleUrl: './depenses.component.css'
})
export class DepensesComponent {
  user = JSON.parse(localStorage.getItem('user') || '{}');
  colocationId = this.user.colocation_id;
  userId = this.user._id;

  members: any[] = localStorage.getItem('colocation') ? JSON.parse(localStorage.getItem('colocation') || '{}').members : [];
  participants: { [key: string]: boolean } = {};
  participantNames: string[] = localStorage.getItem('colocation') ? JSON.parse(localStorage.getItem('colocation') || '{}').members.map((m: any) => m.username) : [];
  
  depenses: any[] = [];
  dettes: any[] = [];
  avoirs: any[] = [];

  isDepenseModalOpen = false;

  depensesToSubmit: any = {
    title: '',
    amount: null,
    category: '',
    paymentDate: '',
    payer: ''
  };

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.getDepenses();
    this.getDettes();
    this.getAvoirs();

    this.participants = this.participantNames.reduce((acc: { [key: string]: boolean }, name: string) => {
      acc[name] = false;
      return acc;
    }, {});
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

  openDepenseModal() {
    this.isDepenseModalOpen = true;
  }

  closeDepenseModal() {
    this.isDepenseModalOpen = false;
  }

  submitDepense() {
    if (!this.depensesToSubmit.title || !this.depensesToSubmit.amount || !this.depensesToSubmit.category || !this.depensesToSubmit.paymentDate || !this.depensesToSubmit.payer) {
      alert('Merci de remplir tous les champs.');
      return;
    }
  
    const colocation = JSON.parse(localStorage.getItem('colocation') || '{}');
    const memberMap = colocation.members.reduce((acc: any, member: any) => {
      acc[member.username] = member.user_id;
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
        alert('Dépense ajoutée avec succès !');
        this.closeDepenseModal();
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Erreur ajout dépense', err);
        alert('Erreur lors de l\'ajout de la dépense.');
      }
    });
  }
  
}
