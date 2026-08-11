import { Component, Inject, Input, OnInit, PLATFORM_ID, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Sidebar } from '../../layout/sidebar/sidebar';
import { ModalError } from '../../modal/modal-error/modal-error';

import { AnalysisService } from '../../core/services/analysis/analysis';
import { Analysis } from '../../core/models/analysis.model';
import { CurrencyPipe, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { CircularScore } from '../../shared/components/circular-score/circular-score';
import { PriceGauge } from '../../shared/components/price-gauge/price-gauge';
import { TitleInfoTooltip } from '../../shared/components/title-info-tooltip/title-info-tooltip';

@Component({
    selector: 'app-analysis-result',
    templateUrl: './analysis-result.html',
    styleUrl: './analysis-result.scss',
    imports: [
        Sidebar,
        ModalError,
        CircularScore,
        PriceGauge,
        DecimalPipe,
        CurrencyPipe,
        TitleInfoTooltip,
    ],
})
export class AnalysisResult implements OnInit {
    @Input() isOpen = false;
    location: any;
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

    get communeBreakdown() {
        const breakdown = this.analysis()?.communeAnalysis?.breakdown;

        if (!breakdown) {
            return [];
        }

        return [
            {
                label: 'Accessibilité',
                score: breakdown.accessibility,
                info: 'Évalue la facilité d’accès à la commune et sa proximité avec les principaux axes routiers, transports et pôles d’activité.',
            },
            {
                label: 'Immobilier',
                score: breakdown.realEstate,
                info: 'Évalue l’attractivité du marché immobilier local, notamment les prix, la demande et la dynamique du marché.',
            },
            {
                label: 'Environnement',
                score: breakdown.environment,
                info: 'Évalue la qualité du cadre de vie, notamment l’environnement, les espaces verts, les nuisances et les équipements à proximité.',
            },
            {
                label: 'Démographie',
                score: breakdown.demographics,
                info: 'Évalue la dynamique démographique de la commune et les caractéristiques de sa population.',
            },
            {
                label: 'Fiscalité',
                score: breakdown.taxation,
                info: 'Évalue le niveau de fiscalité locale et son impact potentiel sur l’attractivité de la commune.',
            },
        ];
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            const id = params.get('id');

            if (!id) {
                return;
            }

            this.analysisService.findOne(id).subscribe({
                next: (analysis: Analysis) => {
                    this.analysis.set(analysis);

                    if (!analysis.location?.property) {
                        this.errorMessage.set('Impossible de localiser ce bien sur la carte.');

                        return;
                    }

                    this.location = analysis.location;

                    setTimeout(() => {
                        this.initMap();
                    }, 300);
                },

                error: (err) => {
                    console.error(err);
                },
            });
        });
    }

    private async initMap() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const analysis = this.analysis();

        const location = analysis?.location;

        if (!analysis || !location?.property) {
            return;
        }

        const leaflet = await import('leaflet');
        const L = leaflet.default;

        // ======================================
        // ICÔNES
        // ======================================

        const apprexiaIcon = L.icon({
            iconUrl: '/markers/location.png',
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [0, -50],
        });

        const icons = {
            metro: L.icon({
                iconUrl: '/markers/metro.png',
                iconSize: [35, 35],
                iconAnchor: [17, 35],
            }),

            bus: L.icon({
                iconUrl: '/markers/bus.png',
                iconSize: [35, 35],
                iconAnchor: [17, 35],
            }),

            shop: L.icon({
                iconUrl: '/markers/shop.png',
                iconSize: [35, 35],
                iconAnchor: [17, 35],
            }),

            bakery: L.icon({
                iconUrl: '/markers/bakery.png',
                iconSize: [35, 35],
                iconAnchor: [17, 35],
            }),

            school: L.icon({
                iconUrl: '/markers/school.png',
                iconSize: [35, 35],
                iconAnchor: [17, 35],
            }),

            default: L.icon({
                iconUrl: '/markers/place.png',
                iconSize: [35, 35],
                iconAnchor: [17, 35],
            }),
        };

        // ======================================
        // CARTE
        // ======================================

        const map = L.map('analysis-map').setView(
            [location.property.lat, location.property.lon],
            15,
        );

        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; Stadia Maps & OpenStreetMap',
        }).addTo(map);

        // Cercle de 500 m

        L.circle([location.property.lat, location.property.lon], {
            radius: 500,
            color: '#6366f1',
            fillOpacity: 0.1,
        }).addTo(map);

        // ======================================
        // POPUP BIEN
        // ======================================

        const pricePerM2 =
            analysis.askingPrice && analysis.surface && analysis.surface > 0
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
                ">
                Voir l'annonce →
            </a>
        `
                : '';

        L.marker([location.property.lat, location.property.lon], {
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
                    🏠 ${analysis.title}
                </div>

                <div style="padding:13px;">

                    <div style="margin-bottom:10px;">
                        <div style="font-size:12px;color:#94a3b8;">
                            Prix affiché
                        </div>

                        <div style="font-size:16px;font-weight:700;">
                            ${analysis.askingPrice?.toLocaleString('fr-FR')} €
                        </div>
                    </div>

                    <div style="display:flex;justify-content:space-between;margin-bottom:12px;">

                        <div>
                            <div style="font-size:12px;color:#94a3b8;">
                                Surface
                            </div>

                            <div style="font-weight:700;">
                                ${analysis.surface} m²
                            </div>
                        </div>

                        <div>
                            <div style="font-size:12px;color:#94a3b8;">
                                Prix/m²
                            </div>

                            <div style="font-weight:700;">
                                ${pricePerM2 ?? '-'} €/m²
                            </div>
                        </div>

                        <div>
                            <div style="font-size:12px;color:#94a3b8;">
                                Score
                            </div>

                            <div style="font-weight:700;">
                                ${analysis.score}/100
                            </div>
                        </div>

                    </div>

                    ${analysisUrlButton}

                </div>

            </div>
        `,
            )
            .openPopup();

        // ======================================
        // AJOUT DES PROXIMITÉS
        // ======================================

        const addNearbyMarker = (place: any, icon: L.Icon, title: string) => {
            if (!place || place.lat == null || place.lon == null) {
                return;
            }

            L.marker([place.lat, place.lon], { icon }).addTo(map).bindPopup(`
                <div style="
                    width:180px;
                    background:#0a0e1a;
                    color:white;
                    border-radius:12px;
                    padding:10px;
                    font-family:Inter,sans-serif;
                ">
                    <strong>${title}</strong><br>

                    ${place.name}<br>

                    <small>
                        📍 ${place.distance} m
                        • 🚶 ${place.walkingTime} min
                    </small>
                </div>
            `);
        };

        // ======================================
        // TRANSPORTS
        // ======================================

        addNearbyMarker(location.transport?.metro, icons.metro, 'Métro');
        addNearbyMarker(location.transport?.tram, icons.metro, 'Tram');
        addNearbyMarker(location.transport?.bus, icons.bus, 'Bus');
        addNearbyMarker(location.transport?.trainStation, icons.metro, 'Gare');

        // ======================================
        // COMMERCES
        // ======================================

        addNearbyMarker(location.shopping?.supermarket, icons.shop, 'Supermarché');

        addNearbyMarker(location.shopping?.bakery, icons.bakery, 'Boulangerie');

        addNearbyMarker(location.shopping?.shoppingCenter, icons.shop, 'Centre commercial');

        // ======================================
        // ÉDUCATION
        // ======================================

        addNearbyMarker(location.education?.kindergarten, icons.school, 'Crèche');

        addNearbyMarker(location.education?.school, icons.school, 'École');

        addNearbyMarker(location.education?.highSchool, icons.school, 'Lycée');

        addNearbyMarker(location.education?.university, icons.school, 'Université');

        addNearbyMarker(location.education?.businessSchool, icons.school, 'École de commerce');
    }

    contactMe() {
        alert("Cette fonctionnalité n'est pas encore disponible");
    }

    downloadReport(id: string) {
        this.isDownloading.set(true);

        this.analysisService
            .downloadReport(id)
            .pipe(finalize(() => this.isDownloading.set(false)))
            .subscribe((blob) => {
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');

                link.href = url;
                link.download = 'rapport-apprexia.pdf';

                link.click();
            });
    }

    get transportItems() {
        return [
            {
                label: 'Métro',
                icon: 'bi bi-train-front',
                value: this.location?.transport?.metro,
            },
            {
                label: 'Bus',
                icon: 'bi bi-bus-front',
                value: this.location?.transport?.bus,
            },
            {
                label: 'Gare',
                icon: 'bi bi-train',
                value: this.location?.transport?.trainStation,
            },
        ];
    }

    get shoppingItems() {
        return [
            {
                label: 'Supermarché',
                icon: 'bi bi-cart',
                value: this.location?.shopping?.supermarket,
            },
            {
                label: 'Boulangerie',
                icon: 'bi bi-shop',
                value: this.location?.shopping?.bakery,
            },
        ];
    }

    get educationItems() {
        return [
            {
                label: 'Crèche',
                icon: 'bi bi-person-hearts',
                value: this.location?.education?.kindergarten,
            },
            {
                label: 'École',
                icon: 'bi bi-book',
                value: this.location?.education?.school,
            },
            {
                label: 'Lycée',
                icon: 'bi bi-mortarboard',
                value: this.location?.education?.highSchool,
            },
            {
                label: 'Université',
                icon: 'bi bi-building',
                value: this.location?.education?.university,
            },
            {
                label: 'École commerce',
                icon: 'bi bi-briefcase',
                value: this.location?.education?.businessSchool,
            },
        ];
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        this.isOpen = true;
    }
}
