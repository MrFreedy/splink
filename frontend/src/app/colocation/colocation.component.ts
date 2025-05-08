import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { count } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-colocation',
  imports: [FormsModule],
  templateUrl: './colocation.component.html',
  styleUrl: './colocation.component.css'
})
export class ColocationComponent {

  name: string = '';

  address: any = {
    street: '',
    city: '',
    postal_code: '',
    country: ''
  };

  user = JSON.parse(localStorage.getItem('user') || '{}');

  codeParts: string[] = [];

  constructor(private router: Router, private apiService: ApiService) {}


  createColocation() {
    const coloc = {
      name: this.name,
      address: this.address
    }

    this.apiService.post('/colocations', coloc).subscribe({
      next: (response: any) => {
        alert('Colocation créée avec succès !');

        this.apiService.put(`/users/${this.user._id}/join`, { colocation_id: response._id }).subscribe({
          next: (response: any) => {
            localStorage.setItem('user', JSON.stringify(response));

            this.apiService.get(`/colocations/${response.colocation_id}`).subscribe({
              next: (coloc: any) => {
                localStorage.setItem('colocation', JSON.stringify(coloc));
                this.router.navigate(['/dashboard']);
              },
              error: (err: any) => {
                console.error('Erreur récupération colocation :', err);
                alert('Impossible de récupérer les informations de la colocation.');
              }
            });
          },
          error: (error: any) => {
            alert('Erreur lors de la mise à jour de l\'utilisateur.');
          }
        });
      }
      , error: (error: any) => {
        alert('Erreur lors de la création de la colocation.');
      }
    });
  }

  joinColocation() {
    const join_code = this.codeParts.join('');

    if (!join_code) {
      alert('Veuillez entrer un code de colocation valide.');
      return;
    }

    this.apiService.put(`/users/${this.user._id}/join`, { join_code }).subscribe({
      next: (response: any) => {

        if (!response || !response.colocation_id) {
          alert('Erreur : aucune colocation associée.');
          return;
        }

        localStorage.setItem('user', JSON.stringify(response));

        const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');

        const colocationId = updatedUser.colocation_id;

        if (!colocationId) {
          alert('Erreur : colocation_id introuvable dans le localStorage.');
          return;
        }

        this.apiService.get(`/colocations/${colocationId}`).subscribe({
          next: (coloc: any) => {
            localStorage.setItem('colocation', JSON.stringify(coloc));

            this.router.navigate(['/dashboard']);
          },
          error: (err: any) => {
            console.error('Erreur récupération colocation :', err);
            alert('Impossible de récupérer les informations de la colocation.');
          }
        });
      },
      error: (error: any) => {
        console.error('Erreur mise à jour utilisateur :', error);
        alert('Erreur lors de la mise à jour de l\'utilisateur.');
      }
    });
  }

}
