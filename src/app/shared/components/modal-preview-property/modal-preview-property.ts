import { Component, computed, HostListener, input, output } from '@angular/core';

export interface PropertyPreview {
    url: string;

    title?: string | null;
    description?: string | null;
    image?: string | null;

    surface?: number | null;
    rooms?: number | null;

    city?: string | null;
    postalCode?: string | null;

    propertyType?: string | null;

    platform?: 'leboncoin' | 'seloger' | 'logicimmo' | string | null;
}

@Component({
    selector: 'app-modal-preview-property',
    standalone: true,
    templateUrl: './modal-preview-property.html',
    styleUrl: './modal-preview-property.scss',
})
export class ModalPreviewProperty {
    // ─────────────────────────────────────────────
    // Inputs
    // ─────────────────────────────────────────────

    isOpen = input(false);

    preview = input<PropertyPreview | null>(null);

    // ─────────────────────────────────────────────
    // Outputs
    // ─────────────────────────────────────────────

    closed = output<void>();

    confirmed = output<PropertyPreview>();

    manualAnalysis = output<void>();

    // ─────────────────────────────────────────────
    // Computed
    // ─────────────────────────────────────────────

    hasIncompleteContent(): boolean {
        const property = this.preview();

        if (!property) {
            return true;
        }

        return !property.title?.trim() || !property.description?.trim();
    }

    hasCriticalContentMissing(): boolean {
        const property = this.preview();

        if (!property) {
            return true;
        }

        // Le titre + la description sont les données
        // nécessaires pour permettre une analyse fiable.
        return !property.title?.trim() && !property.description?.trim();
    }

    getWarningTitle(): string {
        const property = this.preview();

        if (!property) {
            return 'Informations insuffisantes';
        }

        const missingTitle = !property.title?.trim();
        const missingDescription = !property.description?.trim();

        if (missingTitle && missingDescription) {
            return 'Informations insuffisantes pour l’analyse';
        }

        if (missingTitle) {
            return 'Le titre de l’annonce n’a pas été récupéré';
        }

        if (missingDescription) {
            return 'La description de l’annonce n’a pas été récupérée';
        }

        return 'Informations incomplètes';
    }

    getWarningMessage(): string {
        const property = this.preview();

        if (!property) {
            return 'Les informations nécessaires à l’analyse n’ont pas pu être récupérées.';
        }

        const missingTitle = !property.title?.trim();
        const missingDescription = !property.description?.trim();

        if (missingTitle && missingDescription) {
            return 'Nous n’avons pas pu récupérer le titre et la description de cette annonce. L’analyse automatique est susceptible de ne pas fonctionner correctement.';
        }

        if (missingTitle) {
            return 'Nous n’avons pas pu récupérer le titre de cette annonce. L’analyse automatique est susceptible de ne pas fonctionner correctement.';
        }

        if (missingDescription) {
            return 'Nous n’avons pas pu récupérer la description de cette annonce. L’analyse automatique est susceptible de ne pas fonctionner correctement.';
        }

        return 'Certaines informations nécessaires à l’analyse n’ont pas pu être récupérées.';
    }

    goToManualAnalysis(): void {
        this.manualAnalysis.emit();
    }

    // ─────────────────────────────────────────────
    // Keyboard
    // ─────────────────────────────────────────────

    @HostListener('document:keydown.escape')
    onEscape(): void {
        if (this.isOpen()) {
            this.close();
        }
    }

    // ─────────────────────────────────────────────
    // Actions
    // ─────────────────────────────────────────────

    close(): void {
        this.closed.emit();
    }

    confirm(): void {
        const property = this.preview();

        if (!property) {
            return;
        }

        this.confirmed.emit(property);
    }

    onBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.close();
        }
    }

    // ─────────────────────────────────────────────
    // Formatting
    // ─────────────────────────────────────────────

    formatPrice(price?: number | null): string {
        if (price == null) {
            return 'Prix non disponible';
        }

        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
        }).format(price);
    }

    formatSurface(surface?: number | null): string {
        if (surface == null) {
            return '';
        }

        return `${surface} m²`;
    }

    // ─────────────────────────────────────────────
    // Platform
    // ─────────────────────────────────────────────

    getPlatformLabel(): string {
        switch (this.preview()?.platform) {
            case 'leboncoin':
                return 'Leboncoin';

            case 'seloger':
                return 'SeLoger';

            case 'logicimmo':
                return 'Logic-Immo';

            default:
                return 'Annonce immobilière';
        }
    }

    getPlatformClass(): string {
        switch (this.preview()?.platform) {
            case 'leboncoin':
                return 'platform-leboncoin';

            case 'seloger':
                return 'platform-seloger';

            case 'logicimmo':
                return 'Logic-Immo';

            default:
                return '';
        }
    }

    // ─────────────────────────────────────────────
    // Image
    // ─────────────────────────────────────────────

    getDefaultImage(): string {
        return 'images/property-placeholder.jpg';
    }
}
