import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../../services/user/user';
import { ModalService } from '../../services/modal/modal';

export const creditGuard: CanActivateFn = () => {
    const userService = inject(UserService);
    const modalService = inject(ModalService);

    return userService.getMe().pipe(
        map((user) => {
            if (user.credits > 0) {
                return true;
            }

            modalService.open(
                'Crédits insuffisants',
                "Vous n'avez plus de crédits disponibles. Rendez-vous dans la boutique Apprexia pour recharger votre compte et poursuivre vos analyses.",
            );

            return false;
        }),

        catchError(() => {
            modalService.open('Erreur', 'Impossible de vérifier vos crédits actuellement. Essayez de vous reconnecter.');

            return of(false);
        }),
    );
};
