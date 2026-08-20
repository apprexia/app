import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalError } from '../../modal/modal-error/modal-error';
import { ModalFormProperty } from '../../modal/modal-form-property/modal-form-property';
import { ModalService } from '../../core/services/modal/modal';
import { Header } from '../../layout/header/header';
import { MetadataService } from '../../core/services/metadata/metadata';

@Component({
    selector: 'app-analyzis-input',
    imports: [FormsModule, ModalError, ModalFormProperty, Header],
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
    loading = signal(false);

    private mobileMediaQuery = window.matchMedia('(max-width: 768px)');

    constructor(
        private router: Router,
        private metadataService: MetadataService,
    ) {
        this.updateMobileState();

        this.mobileMediaQuery.addEventListener('change', this.updateMobileState.bind(this));
    }

    // ─────────────────────────────────────────────
    // MOBILE
    // ─────────────────────────────────────────────

    private updateMobileState(): void {
        this.isMobile.set(this.mobileMediaQuery.matches);
    }

    // ─────────────────────────────────────────────
    // SCROLL
    // ─────────────────────────────────────────────

    onSlideScroll(event: Event): void {
        const element = event.target as HTMLElement;

        this.isScrolled.set(element.scrollTop > 50);
    }

    // ─────────────────────────────────────────────
    // COLLAGE URL
    // ─────────────────────────────────────────────

    onUrlPaste(event: ClipboardEvent): void {
        const pastedText = event.clipboardData?.getData('text');

        if (!pastedText) {
            return;
        }

        // Recherche une URL dans le texte collé
        const extractedUrl = this.extractUrl(pastedText);

        if (!extractedUrl) {
            console.log('Aucune URL détectée dans le texte collé');

            return;
        }

        // On met l'URL propre dans l'input
        this.url = extractedUrl;
    }

    // ─────────────────────────────────────────────
    // EXTRACTION URL
    // ─────────────────────────────────────────────

    private extractUrl(text: string): string | null {
        if (!text) {
            return null;
        }

        const match = text.match(/https?:\/\/[^\s<>"']+/i);

        if (!match) {
            return null;
        }

        let url = match[0].trim();

        // Nettoyage des caractères parasites
        url = url.replace(/[),.;!?]+$/, '');

        try {
            const parsedUrl = new URL(url);

            if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
                return null;
            }

            return parsedUrl.toString();
        } catch {
            return null;
        }
    }

    // ─────────────────────────────────────────────
    // ANALYSE MANUELLE
    // ─────────────────────────────────────────────

    openModalForm(): void {
        this.isOpenForm = true;
    }

    // ─────────────────────────────────────────────
    // BOUTON ANALYSER
    // ─────────────────────────────────────────────

    submit(): void {
        if (!this.url.trim() || this.loading()) {
            return;
        }

        const extractedUrl = this.extractUrl(this.url);

        if (!extractedUrl) {
            this.modalService.open(
                'URL invalide',
                'Veuillez coller une URL valide correspondant à une annonce immobilière.',
            );

            return;
        }

        this.url = extractedUrl;

        this.router.navigate(['/analyze-processing'], {
            state: {
                url: extractedUrl,
            },
        });
    }
}
