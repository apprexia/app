import { Component, signal, OnDestroy, ChangeDetectionStrategy, input } from '@angular/core';

type CardValue = 'house' | 'empty';

interface GameCard {
    id: number;
    value: CardValue;
    revealed: boolean;
    selected: boolean;
    position: number;
}

@Component({
    selector: 'app-analysis-mini-game',
    standalone: true,
    templateUrl: './analysis-mini-game.html',
    styleUrl: './analysis-mini-game.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalysisMiniGame implements OnDestroy {
    readonly active = input(false);

    readonly cards = signal<GameCard[]>([]);

    readonly score = signal(0);
    readonly gamesPlayed = signal(0);
    readonly gamesWon = signal(0);

    readonly isMixing = signal(false);
    readonly isRevealing = signal(false);
    readonly isWon = signal(false);
    readonly isMemorizing = signal(true);

    private mixTimeout?: ReturnType<typeof setTimeout>;
    private roundTimeout?: ReturnType<typeof setTimeout>;
    private revealTimeout?: ReturnType<typeof setTimeout>;

    constructor() {
        this.startRound();
    }

    ngOnDestroy(): void {
        this.clearTimers();
    }

    /**
     * Démarre une nouvelle manche
     */
    private startRound(): void {
        this.clearTimers();

        this.isMixing.set(false);
        this.isRevealing.set(false);
        this.isWon.set(false);
        this.isMemorizing.set(true);

        this.createRound();

        // 🧠 Temps pour mémoriser la position de la maison
        this.roundTimeout = setTimeout(() => {
            this.hideInitialCards();

            // Petit temps entre le retournement et le mélange
            this.roundTimeout = setTimeout(() => {
                this.mixCards();
            }, 400);
        }, 2000);
    }

    /**
     * Création des 3 cartes
     */
    private createRound(): void {
        const housePosition = Math.floor(Math.random() * 3);

        this.cards.set(
            [0, 1, 2].map((id) => ({
                id,
                value: id === housePosition ? 'house' : 'empty',
                revealed: true,
                selected: false,
                position: id,
            })),
        );
    }

    /**
     * Cache les cartes après la phase de mémorisation
     */
    private hideInitialCards(): void {
        this.cards.set(
            this.cards().map((card) => ({
                ...card,
                revealed: false,
                selected: false,
            })),
        );

        this.isMemorizing.set(false);
    }

    /**
     * Mélange les cartes
     */
    private mixCards(): void {
        if (this.isMixing() || this.isWon()) {
            return;
        }

        this.isMixing.set(true);

        const swaps = [
            [0, 1],
            [1, 2],
            [2, 1],
            [1, 0],
            [0, 2],
            [2, 1],
            [1, 0],
            [0, 1],
            [1, 2],
            [2, 0],
        ];

        let index = 0;

        const performSwap = () => {
            if (index >= swaps.length) {
                this.isMixing.set(false);
                return;
            }

            const [positionA, positionB] = swaps[index];

            const cards = [...this.cards()];

            const cardAIndex = cards.findIndex(
                card => card.position === positionA
            );

            const cardBIndex = cards.findIndex(
                card => card.position === positionB
            );

            if (cardAIndex === -1 || cardBIndex === -1) {
                this.isMixing.set(false);
                return;
            }

            cards[cardAIndex] = {
                ...cards[cardAIndex],
                position: positionB,
            };

            cards[cardBIndex] = {
                ...cards[cardBIndex],
                position: positionA,
            };

            this.cards.set(cards);

            index++;

            this.mixTimeout = setTimeout(
                performSwap,
                320
            );
        };

        performSwap();
    }

    /**
     * Sélection d'une carte
     */
    selectCard(index: number): void {
        if (this.isMemorizing() || this.isMixing() || this.isWon() || this.isRevealing()) {
            return;
        }

        const selectedCard = this.cards()[index];

        if (!selectedCard) {
            return;
        }

        this.isRevealing.set(true);

        // On révèle uniquement la carte choisie
        this.cards.set(
            this.cards().map((card, i) => ({
                ...card,
                selected: i === index,
                revealed: i === index,
            })),
        );

        this.gamesPlayed.update((value) => value + 1);

        /**
         * 🎉 BONNE RÉPONSE
         */
        if (selectedCard.value === 'house') {
            this.gamesWon.update((value) => value + 1);

            this.score.update((value) => value + 100);

            this.isWon.set(true);

            // Révélation de toutes les cartes
            this.revealTimeout = setTimeout(() => {
                this.cards.set(
                    this.cards().map((card) => ({
                        ...card,
                        revealed: true,
                    })),
                );

                this.isRevealing.set(false);
            }, 500);

            return;
        }

        /**
         * ❌ MAUVAISE RÉPONSE
         */

        this.revealTimeout = setTimeout(() => {
            // On montre où était la maison
            this.cards.set(
                this.cards().map((card) => ({
                    ...card,
                    revealed: true,
                })),
            );

            this.revealTimeout = setTimeout(() => {
                // Nouvelle manche
                this.startRound();
            }, 1000);
        }, 500);
    }

    /**
     * Rejouer après avoir trouvé la maison
     */
    replay(): void {
        if (!this.isWon()) {
            return;
        }

        this.startRound();
    }

    /**
     * Nettoyage des timers
     */
    private clearTimers(): void {
        if (this.mixTimeout) {
            clearTimeout(this.mixTimeout);
            this.mixTimeout = undefined;
        }

        if (this.roundTimeout) {
            clearTimeout(this.roundTimeout);
            this.roundTimeout = undefined;
        }

        if (this.revealTimeout) {
            clearTimeout(this.revealTimeout);
            this.revealTimeout = undefined;
        }
    }
}
