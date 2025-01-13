import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inject Router to navigate if not an admin
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    router.navigate(['/home']);
    alert('You are not authorized to access this page.');
    return false;
  }
  return true;
};
