import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID, computed, signal } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AnalysisService } from '../../core/services/analysis/analysis';

interface Step {
    title: string;
    description: string;
    icon: string;
}

@Component({
    selector: 'app-analysis-processing',
    imports: [RouterLink],
    templateUrl: './analysis-processing.html',
    styleUrl: './analysis-processing.scss',
})
export class AnalysisProcessing implements OnInit, OnDestroy {
    private timeoutIds: ReturnType<typeof setTimeout>[] = [];

    private analysisId = '';

    private analysisCompleted = false;

    readonly currentStep = signal(0);

    readonly steps: Step[] = [
        {
            title: 'Analyse de l’annonce',
            description:
                'Extraction automatique des informations clés du bien, de son prix, de sa localisation et de ses caractéristiques.',
            icon: 'bi-file-earmark-richtext',
        },
        {
            title: 'Analyse du marché',
            description:
                'Comparaison avec les biens similaires et les transactions observées pour estimer la valeur réelle.',
            icon: 'bi-shop-window',
        },
        {
            title: 'Évaluation du potentiel',
            description:
                'Analyse de la rentabilité locative, de l’attractivité du secteur et du potentiel d’investissement.',
            icon: 'bi-graph-up-arrow',
        },
        {
            title: 'Détection des risques',
            description:
                'Identification des signaux de vigilance, incohérences et facteurs pouvant impacter la performance du bien.',
            icon: 'bi-shield-shaded',
        },
        {
            title: 'Rapport & recommandation',
            description:
                'Calcul du Score Apprexia™, estimation de valeur et verdict final : Investir, Négocier ou Éviter.',
            icon: 'bi-award',
        },
    ];

    readonly isAnalysisCompleted = computed(() => this.currentStep() >= this.steps.length);

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router,
        private analysisService: AnalysisService,
    ) {}

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const url = history.state.url;

        if (!url) {
            this.router.navigate(['/']);
            return;
        }

        this.startProcessing();
    }

    ngOnDestroy(): void {
        this.timeoutIds.forEach(clearTimeout);
    }

    private startProcessing(): void {
        const url = history.state.url;

        if (!url) {
            this.router.navigate(['/']);
            return;
        }

        // Etapes 1 à 4 uniquement
        for (let index = 0; index < this.steps.length - 1; index++) {
            const timeout = setTimeout(
                () => {
                    this.currentStep.set(index + 1);

                    // Arrivé à l'étape 4,
                    // on démarre l'analyse
                    if (index === this.steps.length - 2) {
                        this.runAnalysis(url);
                    }
                },
                (index + 1) * 2000,
            );

            this.timeoutIds.push(timeout);
        }
    }

    private startPolling() {
        const poll = () => {
            this.analysisService.getStatus(this.analysisId).subscribe({
                next: (response) => {
                    console.log('STATUS:', response.status);

                    switch (response.status) {
                        case 'COMPLETED':
                            this.router.navigate(['/analyze-result', this.analysisId]);
                            break;

                        case 'AI_FAILED':
                        case 'INSUFFICIENT_DATA':
                            this.router.navigate(['/analyze-failed', this.analysisId]);
                            break;

                        case 'SCRAPING':
                        case 'SCRAPED':
                        case 'AI_PROCESSING':
                            // on continue à attendre
                            setTimeout(poll, 1000);
                            break;

                        default:
                            console.warn('Statut inconnu:', response.status);

                            setTimeout(poll, 1000);
                            break;
                    }
                },

                error: (error) => {
                    console.error('Erreur récupération statut analyse', error);

                    setTimeout(poll, 2000);
                },
            });
        };

        poll();
    }

    private runAnalysis(url: string): void {
        this.analysisService.create(url).subscribe({
            next: (response) => {
                this.analysisId = response.id;

                this.startPolling();
            },

            error: console.error,
        });
    }

    getStatus(index: number): 'pending' | 'active' | 'done' {
        const current = this.currentStep();

        if (index < current) {
            return 'done';
        }

        if (index === current) {
            return 'active';
        }

        // Cas spécial :
        // lorsque currentStep = 4,
        // la dernière étape reste active pendant l'appel API
        if (current === 4 && index === 4) {
            return 'active';
        }

        return 'pending';
    }

    getTag(index: number): string {
        const status = this.getStatus(index);

        if (status === 'done') {
            return `Etape ${index + 1}`;
        }

        if (status === 'active') {
            return `Etape ${index + 1} · En cours`;
        }

        return `Etape ${index + 1} · En attente`;
    }
}
