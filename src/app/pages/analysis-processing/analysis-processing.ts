import { Component, computed, Inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AnalysisService } from '../../core/services/analysis/analysis';
import { AnalysisStatus } from '../../core/enums/analysis-status.enum';
import { Header } from '../../layout/header/header';
import { AnalysisMiniGame } from '../../shared/components/analysis-mini-game/analysis-mini-game';

interface Step {
    title: string;
    description: string;
    icon: string;
}

type AnalysisDevice = 'mobile' | 'desktop';

@Component({
    selector: 'app-analysis-processing',
    imports: [Header, AnalysisMiniGame],
    templateUrl: './analysis-processing.html',
    styleUrl: './analysis-processing.scss',
})
export class AnalysisProcessing implements OnInit, OnDestroy {
    private timeoutIds: ReturnType<typeof setTimeout>[] = [];
    private analysisInput: any;
    private isManual = false;
    private analysisId = '';
    private analysisCompleted = false;
    readonly currentStep = signal(0);
    isScrolled = signal(false);

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
                'Score Apprexia™, estimation de valeur et positionnement marché. Veuillez patienter, votre verdict final sera disponible dans ~30–40 secondes.',
            icon: 'bi-award',
        },
    ];

    readonly isAnalysisCompleted = computed(() => this.currentStep() >= this.steps.length);
    readonly miniGameClosed = signal(false);

    readonly showMiniGame = computed(() =>
        this.currentStep() === 4 && !this.miniGameClosed()
    );

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router,
        private route: ActivatedRoute,
        private analysisService: AnalysisService,
    ) {}

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.isManual = this.route.snapshot.queryParamMap.get('isManual') === 'true';

        if (this.isManual) {
            this.analysisInput = this.analysisService.manualAnalysis();

            if (!this.analysisInput) {
                this.router.navigate(['/']);
                return;
            }

            this.startProcessingManual();
            return;
        }

        const url: string = history.state.url;

        if (!url) {
            this.router.navigate(['/']);
            return;
        }

        this.startProcessingAuto(url);
    }

    ngOnDestroy(): void {
        this.timeoutIds.forEach(clearTimeout);
    }

    closeMiniGame(): void {
        this.miniGameClosed.set(true);
    }

    onSlideScroll(event: Event): void {
        const element = event.target as HTMLElement;
        this.isScrolled.set(element.scrollTop > 50);
    }

    private startProcessingManual(): void {
        // ici tu peux transformer analysisInput en payload API
        const payload = this.analysisInput;

        for (let index = 0; index < this.steps.length - 1; index++) {
            const timeout = setTimeout(
                () => {
                    this.currentStep.set(index + 1);

                    if (index === this.steps.length - 2) {
                        this.runManualAnalysis(payload);
                    }
                },
                (index + 1) * 2000,
            );

            this.timeoutIds.push(timeout);
        }
    }

    private runManualAnalysis(payload: any): void {
        this.analysisService.createManual(payload).subscribe({
            next: (response) => {
                this.analysisId = response.id;
                this.startPolling();
            },
            error: console.error,
        });
    }

    private startProcessingAuto(url: string): void {
        if (!url) {
            this.router.navigate(['/']);
            return;
        }
        const device = this.getDeviceType();
        this.runAnalysis(url, device);

        // Etapes 1 à 4 uniquement
        for (let index = 0; index < this.steps.length - 1; index++) {
            const timeout = setTimeout(
                () => {
                    this.currentStep.set(index + 1);
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
                    if (response.status === AnalysisStatus.AI_PROCESSING) {
                        console.log('STATUS:', response.status);
                    }

                    switch (response.status) {
                        case AnalysisStatus.COMPLETED:
                            this.router.navigate(['/analyze-result', this.analysisId]);
                            break;

                        case AnalysisStatus.AI_FAILED:
                        case AnalysisStatus.SCRAPING_FAILED:
                        case AnalysisStatus.INSUFFICIENT_DATA:
                            this.router.navigate(['/analyze-failed', this.analysisId]);
                            break;
                        case AnalysisStatus.UNSUPPORTED_PROPERTY_TYPE:
                            this.router.navigate(['/analyze-unsupported', this.analysisId]);
                            break;
                        case AnalysisStatus.SCRAPING:
                        case AnalysisStatus.SCRAPED:
                        case AnalysisStatus.AI_PROCESSING:
                            this.currentStep.set(4);
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

    private runAnalysis(url: string, device: 'mobile' | 'desktop'): void {
        this.analysisService.create(url, device).subscribe({
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

    private getDeviceType(): AnalysisDevice {
        if (!isPlatformBrowser(this.platformId)) {
            return 'desktop';
        }

        const userAgent = navigator.userAgent.toLowerCase();

        const isMobile =
            /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);

        return isMobile ? 'mobile' : 'desktop';
    }
}
