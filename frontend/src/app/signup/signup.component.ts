import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-signup',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  email: string = '';
  password: string = '';
  username: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  signup() {
    this.apiService.post('/users', { email: this.email, password: this.password, username: this.username }).subscribe({
      next: (response: any) => {
        alert('Inscription réussie !');
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.error('Error creating user:', error);
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
      }});
  }
}
