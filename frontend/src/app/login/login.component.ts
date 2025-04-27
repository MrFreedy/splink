import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    this.http.post<{ message: string, user: { _id: string, email: string, username: string, password: string } }>('http://217.65.146.195:3000/users/login', {
      email: this.email,
      password: this.password
    })
    .pipe(
      tap(response => {
        const { password, ...user } = response.user;
        localStorage.setItem('user', JSON.stringify(user));
        console.log('User data saved to localStorage', user);
        this.router.navigate(['/dashboard']);
      }),
      catchError(error => {
        console.error('Login failed', error);
        alert('Login failed. Please check your credentials.');
        return of(null);
      })
    )
    .subscribe();
  }
}
