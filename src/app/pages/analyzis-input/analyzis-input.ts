import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalError } from '../../modal/modal-error/modal-error';
import { ModalFormProperty } from '../../modal/modal-form-property/modal-form-property';
import { ModalService } from '../../core/services/modal/modal';
import { Header } from '../../layout/header/header';
import { MetadataService } from '../../core/services/metadata/metadata';
import { finalize } from 'rxjs';
import {
    ModalPreviewProperty,
    PropertyPreview,
} from '../../shared/components/modal-preview-property/modal-preview-property';

@Component({
    selector: 'app-analyzis-input',
    imports: [FormsModule, ModalError, ModalFormProperty, ModalPreviewProperty, Header],
    templateUrl: './analyzis-input.html',
    styleUrl: './analyzis-input.scss',
})
export class AnalyzisInput {
    modalService = inject(ModalService);

    url = '';
    isOpenForm = false;

    isOpen = this.modalService.isOpen;
    titleError = this.modalService.title;
    messageError = this.modalService.message;

    isScrolled = signal(false);
    isMobile = signal(false);

    preview = signal<PropertyPreview | null>(null);
    isPreviewModalOpen = signal(false);
    loading = signal(false);
    private mobileMediaQuery = window.matchMedia('(max-width: 768px)');

    constructor(
        private router: Router,
        private metadataService: MetadataService,
    ) {
        this.updateMobileState();

        this.mobileMediaQuery.addEventListener('change', this.updateMobileState.bind(this));
    }

    private updateMobileState(): void {
        this.isMobile.set(this.mobileMediaQuery.matches);
    }

    onSlideScroll(event: Event): void {
        const element = event.target as HTMLElement;
        this.isScrolled.set(element.scrollTop > 50);
    }

    onUrlPaste(event: ClipboardEvent): void {
        const pastedText = event.clipboardData?.getData('text');

        if (!pastedText) {
            return;
        }

        const value = pastedText.trim();

        this.url = value;

        // On invalide toujours l'ancienne preview
        this.preview.set(null);

        // Mobile uniquement
        if (this.isMobile()) {
            this.loadPreview();
        }
    }

    /**
     * Récupération des métadonnées de l'annonce
     */
    loadPreview(): void {
        const url = this.url.trim();

        if (!url || this.loading()) {
            return;
        }

        this.loading.set(true);

        this.metadataService
            .getPreview(url)
            .pipe(
                finalize(() => {
                    this.loading.set(false);
                }),
            )
            .subscribe({
                next: (preview: PropertyPreview) => {
                    console.log('Preview reçue :', preview);

                    // Vérifie que l'utilisateur n'a pas changé
                    // l'URL pendant la requête
                    if (this.url.trim() !== url) {
                        return;
                    }

                    this.preview.set(preview);
                    this.isPreviewModalOpen.set(true);
                },

                error: (error) => {
                    console.error('Erreur récupération preview :', error);

                    this.modalService.open(
                        'Impossible de récupérer l’annonce',
                        'Nous ne pouvons pas récupérer automatiquement les informations de cette annonce.',
                    );
                },
            });
    }

    openManualAnalysis(): void {
        // Ferme la modal de preview
        this.isPreviewModalOpen.set(false);

        // Ouvre le formulaire d'analyse manuelle
        this.isOpenForm = true;
    }

    openModalForm(): void {
        this.isOpenForm = true;
    }

    /**
     * Bouton "Analyser"
     *
     * IMPORTANT :
     * ce bouton peut également déclencher la preview
     * si l'utilisateur tape/copie l'URL puis clique dessus.
     */
    submit(): void {
        if (!this.url.trim() || this.loading()) {
            return;
        }

        // Si on n'a pas encore de preview,
        // on la récupère d'abord.
        if (!this.preview()) {
            this.loadPreview();
            return;
        }

        // Sinon, on ouvre directement la modal de confirmation
        this.isPreviewModalOpen.set(true);
    }

    /**
     * L'utilisateur confirme l'annonce
     */
    confirmAnalysis(preview: PropertyPreview): void {
        this.isPreviewModalOpen.set(false);

        this.router.navigate(['/analyze-processing'], {
            state: {
                url: preview.url,
                preview: preview,
            },
        });
    }
}
