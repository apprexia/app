import { Component, computed, effect, input, signal } from '@angular/core';

@Component({
    selector: 'app-circular-score',
    imports: [],
    templateUrl: './circular-score.html',
    styleUrl: './circular-score.scss',
})
export class CircularScore {
    // ===========================
    // Inputs
    // ===========================

    value = input.required<number>();
    suffix = input('%');
    showMax = input(true);
    showSuffix = input(false);
    decimals = input(0);
    max = input(100);

    size = input(140);

    strokeWidth = input(10);

    duration = input(1200);
    variant = input<'brand' | 'score'>('score');
    // ===========================
    // Animation
    // ===========================

    readonly animatedValue = signal(0);

    readonly radius = computed(() => (this.size() - this.strokeWidth()) / 2);

    readonly circumference = computed(() => 2 * Math.PI * this.radius());

    readonly dashOffset = computed(() => {
        return this.circumference() - (this.animatedValue() / this.max()) * this.circumference();
    });

    readonly gradientId = `score-gradient-${crypto.randomUUID()}`;

    readonly color = computed(() => {
        const percent = this.value() / this.max();

        if (percent >= 0.7) return '#22C55E';

        if (percent >= 0.5) return '#F59E0B';

        return '#EF4444';
    });

    readonly displayValue = computed(() => {
        return this.animatedValue().toFixed(this.decimals());
    });

    readonly gradientColor = computed(() => {
        const percent = this.value() / this.max();

        if (percent < 0.4) {
            return {
                start: '#DC2626',
                end: '#F97316',
            };
        }

        if (percent < 0.7) {
            return {
                start: '#F97316',
                end: '#EAB308',
            };
        }

        return {
            start: '#16A34A',
            end: '#22C55E',
        };
    });

    constructor() {
        effect(() => {
            this.animate();
        });
    }

    private animate() {
        const target = this.value();

        const duration = this.duration();

        let start: number | null = null;

        const frame = (timestamp: number) => {
            if (start === null) {
                start = timestamp;
            }

            const progress = Math.min((timestamp - start) / duration, 1);

            // easing
            const eased = 1 - Math.pow(1 - progress, 3);

            const factor = Math.pow(10, this.decimals());

            this.animatedValue.set(
                Math.round(target * eased * factor) / factor
            );

            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        };

        requestAnimationFrame(frame);
    }
}
