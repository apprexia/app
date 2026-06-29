import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AnalysisService } from '../../core/services/analysis/analysis';
import { FormsModule } from '@angular/forms';
import { ModalError } from '../../modal/modal-error/modal-error';
import { finalize } from 'rxjs';
import { UserService } from '../../core/services/user/user';

@Component({
    selector: 'app-analyzis-input',
    imports: [RouterLink, FormsModule, ModalError],
    templateUrl: './analyzis-input.html',
    styleUrl: './analyzis-input.scss',
})
export class AnalyzisInput {
    url = '';
    loading = false;
    isOpen = false;
    titleError = '';
    messageError = '';

    constructor(
        private userService: UserService,
        private router: Router,
        private cdr: ChangeDetectorRef,
    ) {}

    openModal() {
        this.isOpen = true;
        this.cdr.detectChanges();
    }

    closeModal() {
        this.isOpen = false;
    }

    submit() {
        if (!this.url.trim()) {
            return;
        }

        this.loading = true;

        this.userService
            .getMe()
            .pipe(
                finalize(() => {
                    this.loading = false;
                }),
            )
            .subscribe({
                next: (user) => {
                    if (user.credits <= 0) {
                        this.loading = false;
                        this.titleError = 'Crédits insuffisants';
                        this.messageError =
                            "Vous n'avez plus de crédits disponibles. Rendez-vous dans la boutique Apprexia pour recharger votre compte et poursuivre vos analyses.";
                        this.openModal();
                        return;
                    }

                    this.router.navigate(['/analyze-processing'], {
                        state: {
                            url: this.url,
                        },
                    });
                },

                error: (error) => {
                    console.error(error);
                    this.openModal();
                },
            });
    }
}
