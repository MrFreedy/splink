import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem('userId'); // Vérifie si le token existe

  if (isLoggedIn) {
    return true; // Autorise l'accès
  } else {
    router.navigate(['/login']); // Redirige vers /login
    return false; // Bloque l'accès
  }
};
