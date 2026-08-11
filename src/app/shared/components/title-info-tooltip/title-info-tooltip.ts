import { Component, input, signal } from '@angular/core';

@Component({
    selector: 'app-title-info-tooltip',
    imports: [],
    templateUrl: './title-info-tooltip.html',
    styleUrl: './title-info-tooltip.scss',
})
export class TitleInfoTooltip {
    label = input<string>('');
    text = input<string>('');
    formula = input<string>('');
    class = input<string>('');

    private static activeTooltip: TitleInfoTooltip | null = null;

    isVisible = signal(false);

    toggleTooltip(event: MouseEvent) {
        event.stopPropagation();

        // Ferme la tooltip actuellement ouverte
        if (TitleInfoTooltip.activeTooltip && TitleInfoTooltip.activeTooltip !== this) {
            TitleInfoTooltip.activeTooltip.isVisible.set(false);
        }

        // Toggle de la tooltip actuelle
        this.isVisible.update((value) => !value);

        // Mémorise l'instance active
        TitleInfoTooltip.activeTooltip = this.isVisible() ? this : null;
    }
}
