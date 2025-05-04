import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  login() {
    this.apiService.login(this.email, this.password)
      .pipe(
        tap((response: { message: string, user: { _id: string, email: string, username: string, password: string, colocation_id?: string } }) => {
          const { password, ...user } = response.user;
          localStorage.setItem('user', JSON.stringify(user));
          if (user.colocation_id) {
            this.apiService.get(`/colocations/${user.colocation_id}`).subscribe((data: any) => {
              localStorage.setItem('colocation', JSON.stringify(data));
              this.router.navigate(['/dashboard']);
            });
          } else {
            this.router.navigate(['/colocation']);
          }
        }),
        catchError(error => {
          alert('Login failed. Please check your credentials.');
          return of(null);
        })
      )
      .subscribe();
  }
}
