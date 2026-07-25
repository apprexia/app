import { Component, Input, OnInit, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Sidebar } from '../../layout/sidebar/sidebar';
import { ModalError } from '../../modal/modal-error/modal-error';

import { AnalysisService } from '../../core/services/analysis/analysis';
import { Analysis } from '../../core/models/analysis.model';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-analysis-result',
    templateUrl: './analysis-result.html',
    styleUrl: './analysis-result.scss',
    imports: [Sidebar, ModalError, CurrencyPipe],
})
export class AnalysisResult implements OnInit {
    @Input() isOpen = false;
    errorMessage = signal<string | null>(null);
    isDownloading = signal<boolean>(false);
    readonly coordinates = signal<{
        latitude: number;
        longitude: number;
    } | null>(null);
    readonly analysis = signal<Analysis | null>(null);

    constructor(
        private route: ActivatedRoute,
        private analysisService: AnalysisService,
        private router: Router,
        private http: HttpClient,
        @Inject(PLATFORM_ID)
        private platformId: Object,
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            const id = params.get('id');

            if (!id) {
                return;
            }

            this.analysisService.findOne(id).subscribe({
                next: (analysis: Analysis) => {
                    this.analysis.set(analysis);

                    if (analysis.city && analysis.codePostal) {
                        this.http
                            .get<any>('https://api-adresse.data.gouv.fr/search/', {
                                params: {
                                    q: `${analysis.codePostal} ${analysis.city}`,
                                    limit: 1,
                                },
                            })
                            .subscribe({
                                next: (response) => {
                                    const feature = response.features[0];

                                    if (feature) {
                                        const coords = feature.geometry.coordinates;
                                        console.log(coords);

                                        this.coordinates.set({
                                            longitude: coords[0],
                                            latitude: coords[1],
                                        });

                                        setTimeout(() => {
                                            this.initMap(coords[1], coords[0]);
                                        }, 500);
                                    } else {
                                        console.error(
                                            'Impossible de trouver les coordonnées pour cette adresse',
                                        );
                                        this.errorMessage.set(
                                            'Impossible de localiser ce bien sur la carte.',
                                        );
                                    }
                                },

                                error: (err) => {
                                    console.error('Erreur géocodage', err);

                                    this.errorMessage.set(
                                        'Une erreur est survenue lors de la localisation du bien.',
                                    );
                                },
                            });
                    } else {
                        console.error('Données insuffisantes pour la géolocalisation', {
                            city: analysis.city,
                            codePostal: analysis.codePostal,
                        });

                        this.errorMessage.set(
                            'Impossible d’afficher la carte : la ville ou le code postal du bien est manquant.',
                        );
                    }
                },
                error: (err) => {
                    console.error(err);
                },
            });
        });
    }

    private async initMap(latitude: number, longitude: number) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const L = await import('leaflet');

        const apprexiaIcon = L.icon({
            iconUrl: '/markers/location.png',
            iconSize: [50, 50],

            iconAnchor: [25, 50],

            popupAnchor: [0, -50],
        });

        const map = L.map('analysis-map').setView([latitude, longitude], 14);

        const analysis = this.analysis();

        if (!analysis) {
            return;
        }

        const pricePerM2 =
            analysis.askingPrice != null && analysis.surface != null && analysis.surface > 0
                ? Math.round(analysis.askingPrice / analysis.surface)
                : null;

        const analysisUrlButton =
            analysis.url !== 'manual'
                ? `
        <a
            href="${analysis.url}"
            target="_blank"
            rel="noopener noreferrer"
            style="
                display:block;
                text-align:center;
                text-decoration:none;
                color:white;
                padding:6px;
                font-size:11px;
                border-radius:30px;
                font-weight:600;
                background:linear-gradient(135deg,#6366f1,#ec4899);
            "
        >
            Voir l'annonce →
        </a>
    `
                : '';

        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; Stadia Maps & OpenStreetMap',
        }).addTo(map);

        L.marker([latitude, longitude], {
            icon: apprexiaIcon,
        })
            .addTo(map)
            .bindPopup(
                `
<div style="
    width:220px;
    background:#0a0e1a;
    color:white;
    border-radius:16px;
    overflow:hidden;
    font-family:Inter,sans-serif;
">

    <div style="
        padding:12px 14px;
        background:linear-gradient(135deg,#6366f1,#ec4899);
        font-weight:600;
        font-size:12px;
    ">
        <i class="bi bi-house-door"></i> ${analysis.title}
    </div>

    <div style="padding:13px;">

        <div style="margin-bottom:10px;">
            <div style="font-size:12px;color:#94a3b8;">Prix affiché</div>
            <div style="font-size:16px;font-weight:700;">
                ${analysis.askingPrice?.toLocaleString('fr-FR')} €
            </div>
        </div>

        <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
            <div>
                <div style="font-size:12px;color:#94a3b8;">Surface</div>
                <div style="font-weight:700;">${analysis.surface} m²</div>
            </div>

            <div>
                <div style="font-size:12px;color:#94a3b8;">Prix/m²</div>
                <div style="font-weight:700;">${pricePerM2 ?? '-'} €/m²</div>
            </div>

            <div>
                <div style="font-size:12px;color:#94a3b8;">Score</div>
                <div style="font-weight:700;">${analysis.score}/100</div>
            </div>
        </div>

        ${analysisUrlButton}

    </div>

</div>
`,
                {
                    className: 'apprexia-popup',
                },
            )
            .openPopup();
    }

    downloadReport(id: string) {
        this.isDownloading.set(true);
        this.analysisService
            .   downloadReport(id)
            .pipe(finalize(() => this.isDownloading.set(false)))
            .subscribe((blob) => {
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');

                link.href = url;

                link.download = 'rapport-apprexia.pdf';

                link.click();
            });
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        this.isOpen = true;
    }
}
