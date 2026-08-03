import { Component, computed, input } from '@angular/core';

@Component({
    selector: 'app-price-gauge',
    imports: [],
    templateUrl: './price-gauge.html',
    styleUrl: './price-gauge.scss',
})
export class PriceGauge {
    askingPrice = input.required<number>();

    estimatedLow = input.required<number>();

    estimatedHigh = input.required<number>();

    referenceValue = input<number | null>(null);

    askingLabel = input('Prix affiché');

    referenceLabel = input('Référence');

    readonly min = computed(() => this.estimatedLow());

    readonly max = computed(() => this.estimatedHigh());

    readonly range = computed(() => this.max() - this.min());

    readonly askingPosition = computed(() => {
        const value = this.askingPrice();

        return this.toPercent(value);
    });

    readonly dvfPosition = computed(() => {
        if (!this.referenceValue()) {
            return null;
        }

        return this.toPercent(this.referenceValue()!);
    });

    private toPercent(value: number): number {
        const percent = ((value - this.min()) / this.range()) * 100;

        return Math.max(0, Math.min(100, percent));
    }

    format(value: number) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
        }).format(value);
    }
}
