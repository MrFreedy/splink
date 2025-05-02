import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parametres',
  imports: [],
  templateUrl: './parametres.component.html',
  styleUrl: './parametres.component.css'
})
export class ParametresComponent {
  constructor(private router: Router) {}

  logout(){
    // Display a confirmation dialog
    const confirmation = confirm('Souhaitez-vous vous déconnecter ?');
    if (!confirmation) {
      return; // User clicked "Cancel", do nothing
    }
    localStorage.removeItem('user');
    localStorage.removeItem('colocation')
    this.router.navigate(['/login']);
  }
}
