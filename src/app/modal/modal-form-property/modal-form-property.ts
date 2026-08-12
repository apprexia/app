import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddressService } from '../../core/services/address/address';
import { catchError, debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AnalysisService } from '../../core/services/analysis/analysis';
import { Router } from '@angular/router';
import { ManualAnalysis } from '../../core/models/manual-analysis.model';
import { UserService } from '../../core/services/user/user';
import { ModalService } from '../../core/services/modal/modal';

type PropertyType = 'Maison' | 'Appartement';

interface PropertyFeature {
    key: PropertyFeatureKey;
    label: string;
    types: PropertyType[];
}

interface PropertyFeatureGroup {
    title: string;
    features: PropertyFeature[];
}

type PropertyFeatureKey =
    | 'duplex'
    | 'triplex'
    | 'loft'
    | 'terrasse'
    | 'balcon'
    | 'loggia'
    | 'jardin'
    | 'patio'
    | 'piscine'
    | 'jacuzzi'
    | 'spa'
    | 'sauna'
    | 'parking'
    | 'garage'
    | 'box'
    | 'cave'
    | 'grenier'
    | 'ascenseur'
    | 'gardien'
    | 'digicode'
    | 'interphone'
    | 'visiophone'
    | 'climatisation'
    | 'cheminee'
    | 'cuisineEquipee'
    | 'dressing'
    | 'buanderie'
    | 'vueMer'
    | 'vueMontagne'
    | 'vuePanoramique'
    | 'vueDegagee'
    | 'dernierEtage'
    | 'traversant'
    | 'lumineux'
    | 'calme'
    | 'renove'
    | 'standing'
    | 'prestige';

@Component({
    selector: 'app-modal-form-property',
    imports: [CommonModule, FormsModule],
    templateUrl: './modal-form-property.html',
    styleUrl: './modal-form-property.scss',
})
export class ModalFormProperty {
    private userService = inject(UserService);
    private modalService = inject(ModalService);
    private addressService = inject(AddressService);
    private analysisService = inject(AnalysisService);
    private router = inject(Router);
    isOpen = input(false);
    closed = output<void>();
    readonly step = signal(0);
    readonly errorMessage = signal('');
    readonly query = signal('');
    readonly addresses = signal<any[]>([]);

    form = {
        adresse: '',
        ville: '',
        codePostal: '',

        latitude: null as number | null,
        longitude: null as number | null,

        typeLocal: '',

        surface: null as number | null,
        terrain: null as number | null,
        pieces: null as number | null,
        prix: null as number | null,

        etat: '',
        etage: null as number | null,

        dpe: '',
        ges: '',
        sourceSite: '',

        propertyFeatures: {
            duplex: false,
            triplex: false,
            loft: false,

            terrasse: false,
            balcon: false,
            loggia: false,
            jardin: false,
            patio: false,

            piscine: false,
            jacuzzi: false,
            spa: false,
            sauna: false,

            parking: false,
            garage: false,
            box: false,
            cave: false,
            grenier: false,

            ascenseur: false,
            gardien: false,
            digicode: false,
            interphone: false,
            visiophone: false,

            climatisation: false,
            cheminee: false,
            cuisineEquipee: false,
            dressing: false,
            buanderie: false,

            vueMer: false,
            vueMontagne: false,
            vuePanoramique: false,
            vueDegagee: false,

            dernierEtage: false,
            traversant: false,
            lumineux: false,
            calme: false,
            renove: false,
            standing: false,
            prestige: false,
        },
    };

    readonly propertyFeatureGroups: PropertyFeatureGroup[] = [
        {
            title: 'Type de bien',
            features: [
                {
                    key: 'duplex',
                    label: 'Duplex',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'triplex',
                    label: 'Triplex',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'loft',
                    label: 'Loft',
                    types: ['Appartement'],
                },
            ],
        },

        {
            title: 'Extérieurs',
            features: [
                {
                    key: 'terrasse',
                    label: 'Terrasse',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'balcon',
                    label: 'Balcon',
                    types: ['Appartement'],
                },
                {
                    key: 'loggia',
                    label: 'Loggia',
                    types: ['Appartement'],
                },
                {
                    key: 'jardin',
                    label: 'Jardin',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'patio',
                    label: 'Patio',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'piscine',
                    label: 'Piscine',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'jacuzzi',
                    label: 'Jacuzzi',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'spa',
                    label: 'Spa',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'sauna',
                    label: 'Sauna',
                    types: ['Maison', 'Appartement'],
                },
            ],
        },

        {
            title: 'Stationnement & dépendances',
            features: [
                {
                    key: 'parking',
                    label: 'Parking',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'garage',
                    label: 'Garage',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'box',
                    label: 'Box',
                    types: ['Appartement'],
                },
                {
                    key: 'cave',
                    label: 'Cave',
                    types: ['Appartement'],
                },
                {
                    key: 'grenier',
                    label: 'Grenier',
                    types: ['Maison', 'Appartement'],
                },
            ],
        },

        {
            title: 'Équipements',
            features: [
                {
                    key: 'ascenseur',
                    label: 'Ascenseur',
                    types: ['Appartement'],
                },
                {
                    key: 'gardien',
                    label: 'Gardien',
                    types: ['Appartement'],
                },
                {
                    key: 'digicode',
                    label: 'Digicode',
                    types: ['Appartement'],
                },
                {
                    key: 'interphone',
                    label: 'Interphone',
                    types: ['Appartement'],
                },
                {
                    key: 'visiophone',
                    label: 'Visiophone',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'climatisation',
                    label: 'Climatisation',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'cheminee',
                    label: 'Cheminée',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'cuisineEquipee',
                    label: 'Cuisine équipée',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'dressing',
                    label: 'Dressing',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'buanderie',
                    label: 'Buanderie',
                    types: ['Maison', 'Appartement'],
                },
            ],
        },

        {
            title: 'Vue',
            features: [
                {
                    key: 'vueMer',
                    label: 'Vue mer',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'vueMontagne',
                    label: 'Vue montagne',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'vuePanoramique',
                    label: 'Vue panoramique',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'vueDegagee',
                    label: 'Vue dégagée',
                    types: ['Maison', 'Appartement'],
                },
            ],
        },

        {
            title: 'Caractéristiques',
            features: [
                {
                    key: 'dernierEtage',
                    label: 'Dernier étage',
                    types: ['Appartement'],
                },
                {
                    key: 'traversant',
                    label: 'Traversant',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'lumineux',
                    label: 'Lumineux',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'calme',
                    label: 'Calme',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'renove',
                    label: 'Rénové',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'standing',
                    label: 'Standing',
                    types: ['Maison', 'Appartement'],
                },
                {
                    key: 'prestige',
                    label: 'Prestige',
                    types: ['Maison', 'Appartement'],
                },
            ],
        },
    ];

    constructor() {
        const destroyRef = inject(DestroyRef);

        toObservable(this.query)
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                filter((q) => q.trim().length >= 3),
                switchMap((q) =>
                    this.addressService.search(q).pipe(catchError(() => of({ features: [] }))),
                ),
                takeUntilDestroyed(destroyRef),
            )
            .subscribe((result) => {
                this.addresses.set(result.features);
            });
    }

    next() {
        if (this.step() === 0 && !this.form.adresse) {
            this.showError('Veuillez sélectionner une adresse.');
            return;
        }

        if (this.step() === 1) {
            if (!this.form.typeLocal || !this.form.surface || !this.form.pieces) {
                this.showError('Veuillez compléter les caractéristiques du bien.');
                return;
            }
        }

        if (this.step() === 2) {
            if (!this.form.etat || !this.form.dpe) {
                this.showError('Veuillez compléter les prestations du bien.');
                return;
            }
        }

        if (this.step() < 3) {
            this.step.update((v) => v + 1);
        }
    }

    back() {
        if (this.step() > 0) this.step.update((v) => v - 1);
    }

    close() {
        this.step.set(0);
        this.closed.emit();
    }

    isFeatureVisible(feature: PropertyFeature): boolean {
        return feature.types.includes(this.form.typeLocal as PropertyType);
    }

    showError(message: string) {
        this.errorMessage.set(message);

        setTimeout(() => {
            this.errorMessage.set('');
        }, 4000);
    }

    selectAddress(address: any) {
        const props = address.properties;
        const [longitude, latitude] = address.geometry.coordinates;

        this.form.adresse = props.label;
        this.form.ville = props.city;
        this.form.codePostal = props.postcode;
        this.form.latitude = latitude;
        this.form.longitude = longitude;

        this.query.set(props.label);
        this.addresses.set([]);
    }

    submit() {
        if (!this.validateForm()) {
            return;
        }

        this.userService.getMe().subscribe({
            next: (user) => {
                if (user.credits <= 0) {
                    this.showError(
                        "Vous n'avez plus de crédits disponibles. Veuillez recharger votre compte.",
                    );
                    return;
                }

                const analysis = this.buildAnalysis();

                this.analysisService.manualAnalysis.set(analysis);

                this.router.navigate(['/analyze-processing'], {
                    queryParams: { isManual: true },
                });
            },

            error: () => {
                this.showError('Impossible de vérifier vos crédits actuellement. Veuillez-vous connecter.');
            },
        });
    }

    private validateForm(): boolean {
        const validations = [
            {
                condition: !this.form.adresse,
                message: 'Veuillez saisir une adresse.',
            },
            {
                condition: !this.form.typeLocal || !this.form.surface || !this.form.pieces,
                message: 'Veuillez saisir les caractéristiques manquantes.',
            },
            {
                condition: !this.form.etat || !this.form.dpe,
                message: 'Veuillez saisir les prestations manquantes',
            },
            {
                condition: !this.form.prix,
                message: 'Veuillez saisir un prix.',
            },
        ];

        const error = validations.find((v) => v.condition);

        if (error) {
            this.showError(error.message);
            return false;
        }

        return true;
    }

    private buildAnalysis(): ManualAnalysis {
        return {
            adresse: this.form.adresse,
            ville: this.form.ville,
            codePostal: this.form.codePostal,

            latitude: this.form.latitude!,
            longitude: this.form.longitude!,

            typeLocal: this.form.typeLocal,

            surface: this.form.surface!,
            terrain: this.form.terrain!,

            pieces: this.form.pieces!,
            prix: this.form.prix!,

            etage: this.form.etage,
            etat: this.form.etat,

            dpe: this.form.dpe,
            ges: this.form.ges,

            propertyFeatures: this.form.propertyFeatures,

            sourceSite: this.form.sourceSite,
        };
    }
}
