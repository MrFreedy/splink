import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const isLoggedIn = !!user && !!user._id;

  if (isLoggedIn) {
    if (!user.colocation_id) {
      router.navigate(['/colocation']);
      return false;
    }
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const isLoggedIn = !!user && !!user._id;

  if (isLoggedIn) {
    if (!user.colocation_id) {
      return true;
    }
    router.navigate(['/dashboard']);
    return false;
  } else {
    return true;
  }
};

export const colocationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const isLoggedIn = !!user && !!user._id;

  if (isLoggedIn && !user.colocation_id) {
    return true;
  }

  router.navigate([isLoggedIn ? '/dashboard' : '/login']);
  return false;
};