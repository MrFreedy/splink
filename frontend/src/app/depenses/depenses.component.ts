import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartItemComponent } from '../chart-item/chart-item.component';
import { ApiService } from '../services/api.service';
import { DettesItemComponent } from '../dettes-item/dettes-item.component';
import { AvoirsItemComponent } from '../avoirs-item/avoirs-item.component';
import { FormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-depenses',
  imports: [CommonModule, ChartItemComponent, DettesItemComponent, AvoirsItemComponent, FormsModule],
  templateUrl: './depenses.component.html',
  styleUrl: './depenses.component.css'
})
export class DepensesComponent {
  @ViewChild('chartItem') chartItem!: ChartItemComponent;  
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
  isSelectEditDepenseModalOpen = false;
  isEditDepenseModalOpen = false;
  isSelectDeleteDepenseModalOpen = false;
  isDeleteDepenseModalOpen = false;
  isSelectPayerModalOpen = false;

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

  openSelectEditDepenseModal() {
    this.isSelectEditDepenseModalOpen = true;
  }

  openEditDepenseModal(depense: any) {
    this.isEditDepenseModalOpen = true;
    this.isSelectEditDepenseModalOpen = false;
  }

  openSelectDeleteDepenseModal() {
    this.isSelectDeleteDepenseModalOpen = true;
  }

  openSelectPayerModal() {
    this.isSelectPayerModalOpen = true;
  }

  closeSelectDeleteDepenseModal() {
    this.isSelectDeleteDepenseModalOpen = false;
  }

  closeDepenseModal() {
    this.isDepenseModalOpen = false;
  }

  closeSelectEditDepenseModal() {
    this.isSelectEditDepenseModalOpen = false;
  }

  closeSelectPayerModal() {
    this.isSelectPayerModalOpen = false;
  }

  closeEditDepenseModal() {
    this.isEditDepenseModalOpen = false;
    this.depensesToSubmit = {
      title: '',
      amount: null,
      category: '',
      paymentDate: '',
      payer: ''
    };
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
        this.chartItem.onOptionChange();
      },
      error: (err) => {
        console.error('Erreur ajout dépense', err);
        alert('Erreur lors de l\'ajout de la dépense.');
      }
    });
  }

  selectEditDepense(depense: any) {  
    const [day, month, year] = depense.paymentDate.split('/');
    const formattedDate = `${year}-${month}-${day}`;
  
    this.depensesToSubmit = {
      _id: depense._id,
      title: depense.title,
      amount: depense.amount,
      category: depense.category,
      paymentDate: formattedDate,
      payer: depense.paid_by
    };
  
    this.participants = this.participantNames.reduce((acc: { [key: string]: boolean }, name: string) => {
      acc[name] = depense.shared_between.includes(
        this.members.find((m: any) => m.username === name)?.user_id
      );
      return acc;
    }, {});
  
    this.openEditDepenseModal(depense);
  }

  submitEditDepense() {
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
    
    const updatedDepense = {
      title: this.depensesToSubmit.title,
      amount: parseFloat(this.depensesToSubmit.amount),
      category: this.depensesToSubmit.category,
      paymentDate: new Date(this.depensesToSubmit.paymentDate),
      paid_by: paid_by_id,
      shared_between: shared_between_ids,
      colocation_id: this.colocationId,
      status: "à payer"
    };
    
    this.apiService.put(`/depenses/${this.depensesToSubmit._id}`, updatedDepense).subscribe({
      next: (response) => {
        alert('Dépense modifiée avec succès !');
        this.closeEditDepenseModal();
        this.ngOnInit();
        this.chartItem.onOptionChange();
      },
      error: (err) => {
        console.error('Erreur modification dépense', err);
        alert('Erreur lors de la modification de la dépense.');
      }
    });
  }

  submitDeleteDepense(depense: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      this.apiService.delete(`/depenses/${depense._id}`).subscribe({
        next: (response) => {
          alert('Dépense supprimée avec succès !');
          this.closeSelectDeleteDepenseModal();
          this.ngOnInit();
          this.chartItem.onOptionChange();
        },
        error: (err) => {
          console.error('Erreur suppression dépense', err);
          alert('Erreur lors de la suppression de la dépense.');
        }
      });
    }
  }

  submitPayer(dette: any) {
    if (confirm('Êtes-vous sûr de vouloir marquer cette dépense comme payée ?')) {
      this.apiService.post(`/depenses/${dette.depenseId}/repay`, { userId: this.userId }).subscribe({
        next: () => {
          alert('Remboursement enregistré avec succès !');
          this.closeSelectPayerModal();
          this.ngOnInit();
          this.chartItem.onOptionChange();
        },
        error: (err) => {
          console.error('Erreur remboursement', err);
          alert('Erreur lors de l\'enregistrement du remboursement.');
        }
      });
    }
  }
  
  getSharedUsernames(depense: any): string {
    if (!depense.shared_between || !this.members?.length) return '—';
  
    return depense.shared_between
      .map((id: string) => this.members.find((m: any) => m.user_id === id)?.username)
      .filter((name: string | undefined) => !!name)
      .join(', ');
  }

  relancer(){
    alert('Relance envoyée ! (Simulé)');
  }
}
