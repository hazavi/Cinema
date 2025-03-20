import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLogin = localStorage.getItem('isLogin') === 'true';

  if (isLogin) {
    router.navigate(['/home']);
    alert('You are already logged in!');
    return false;
  }

  return true;
};
