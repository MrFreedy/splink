import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-parametres',
  imports: [FormsModule, CommonModule],
  templateUrl: './parametres.component.html',
  styleUrl: './parametres.component.css'
})
export class ParametresComponent {
  user = JSON.parse(localStorage.getItem('user') || '{}');
  colocation = JSON.parse(localStorage.getItem('colocation') || '{}');

  tempColoc = this.colocation;

  isDetailsColocOpen = false;
  isMembersColocOpen = false;

  settings = this.user.settings || {
    theme: 'light',
    notifications: true,
    language: 'fr',
    date_format: 'DD/MM/YYYY'
  };

  editedMembers: any[] = [];

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.sync(true);
  }

  logout(){
    const confirmation = confirm('Souhaitez-vous vous déconnecter ?');
    if (!confirmation) {
      return;
    }
    localStorage.removeItem('user');
    localStorage.removeItem('colocation')
    this.router.navigate(['/login']);
  }

  onSwitchToggle(event: any) {
    const isChecked = event.target.checked;
    this.settings.notifications = isChecked;
  }

  saveSettings() {
    this.user.settings = this.settings;
    localStorage.setItem('user', JSON.stringify(this.user));

    this.apiService.put(`/users/${this.user._id}`, this.user).subscribe({
      next: (response) => {
        alert('Paramètres sauvegardés avec succès !');
      },
      error: (error: any) => {
        console.error('Error saving settings:', error);
      }
    });
  }

  toggleNotifications(event: any) {
    this.settings.notifications = event.target.checked;
  }

  isUserAdmin(): boolean {
    const userId = this.user._id;
    return this.colocation.members?.some(
      (member: any) => member.user_id === userId && member.role === 'admin'
    );
  }

  openDetailsColocModal() {
    this.tempColoc = JSON.parse(JSON.stringify(this.colocation));
    this.isDetailsColocOpen = true;
  }

  openMembersColocModal() {
    this.editedMembers = this.colocation.members.map((member: any) => ({
      user_id: member.user_id,
      username: member.username,
      role: member.role
    }));
    this.isMembersColocOpen = true;
  }

  closeDetailsColocModal() {
    this.isDetailsColocOpen = false;
  }

  closeMembersColocModal() {
    this.isMembersColocOpen = false;
  }

  removeMember(member: any) {
    const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer ${member.username} ?`);
    if (!confirmation) {
      return;
    }
    this.editedMembers = this.colocation.members.filter((m: any) => m.user_id !== member.user_id);
    this.tempColoc.members = this.editedMembers;
  }

  saveColocationDetails() {
    this.colocation = this.tempColoc;
    this.apiService.put(`/colocations/${this.colocation._id}`, this.colocation).subscribe({
      next: (response) => {
        alert('Informations mise à jour avec succès !');
        this.closeDetailsColocModal();
        this.closeMembersColocModal();
      },
      error: (error: any) => {
        console.error('Error saving colocation:', error);
      }
    });
  }

  sync(bypass: boolean = false) {
    if (!bypass) {
      const confirmation = confirm('Êtes-vous sûr de vouloir resynchroniser votre session ?');
      if (!confirmation) {
        return;
      }
    }

    this.apiService.get(`/users/${this.user._id}`).subscribe({
      next: (response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.user = response;
        this.apiService.get(`/colocations/${this.colocation._id}`).subscribe({
          next: (response) => {
            localStorage.setItem('colocation', JSON.stringify(response));
            this.colocation = response;
          },
          error: (error: any) => {
            console.error('Error fetching colocation:', error);
          }
        });
        if(!bypass){
          alert('Session resynchronisée avec succès !');
        }
      },
      error: (error: any) => {
        console.error('Error resyncing session:', error);
      }
    });
  }

  leftColoc() {
    const confirmation = confirm('Êtes-vous sûr de vouloir quitter la colocation ?');
    if (!confirmation) {
      return;
    }

    const currentUserId = this.user._id;
    const isAdmin = this.colocation.members.find((m: any) => m.user_id === currentUserId)?.role === 'admin';
    if (isAdmin) {
      const otherAdmins = this.colocation.members.filter(
        (member: any) => member.user_id !== currentUserId && member.role === 'admin'
      );
      if (otherAdmins.length === 0) {
        alert("Vous êtes le seul administrateur de la colocation. Veuillez nommer un autre admin avant de partir.");
        return;
      }
    }

    this.apiService.get(`/depenses/user/${currentUserId}/dettes`).subscribe({
      next: (dettes) => {
        const dettesArray = dettes as any[];
        if (dettesArray.length > 0) {
          alert("Vous ne pouvez pas quitter la colocation tant que vous avez des dettes à payer.");
          return;
        }

        this.apiService.delete(`/colocations/${this.colocation._id}/members/${currentUserId}`).subscribe({
          next: (response) => {
            alert('Vous avez quitté la colocation avec succès !');
            localStorage.removeItem('colocation');
            this.router.navigate(['/login']);
          },
          error: (error: any) => {
            console.error('Error leaving colocation:', error);
          }
        });
      },
      error: (error: any) => {
        console.error('Erreur lors de la vérification des dettes :', error);
        alert("Une erreur est survenue lors de la vérification de vos dettes.");
      }
    });
  }
}
