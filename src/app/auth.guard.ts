import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    // Verifique se o usuário está autenticado
    const isAuthenticated = localStorage.getItem('auth_token') !== null;

    if (isAuthenticated) {
        return true;
    }

    // Redireciona para login mantendo a URL que tentou acessar
    return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: router.url }
    });
};