import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../../services/session/session';

export const adminGuard: CanActivateFn = () => {
    const session = inject(SessionService);
    const router = inject(Router);

    if (session.isAdmin()) {
        return true;
    }

    return router.createUrlTree(['/']);
};
