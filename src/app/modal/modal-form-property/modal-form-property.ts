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
        }
    };

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

        console.log('FORM:', this.form);

        if (!this.validateForm()) {
            return;
        }

        this.userService.getMe().subscribe({
            next: (user) => {

                if (user.credits <= 0) {
                    this.showError(
                        'Vous n\'avez plus de crédits disponibles. Veuillez recharger votre compte.'
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
                this.showError(
                    "Impossible de vérifier vos crédits actuellement."
                );
            }
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

            propertyFeatures: this.form.propertyFeatures,

            sourceSite: this.form.sourceSite,
        };
    }
}
