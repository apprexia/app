import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddressService } from '../../core/services/address/address';
import { catchError, debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AnalysisService } from '../../core/services/analysis/analysis';
import { Router } from '@angular/router';
import { ManualAnalysis } from '../../core/models/manual-analysis.model';

@Component({
    selector: 'app-modal-form-property',
    imports: [CommonModule, FormsModule],
    templateUrl: './modal-form-property.html',
    styleUrl: './modal-form-property.scss',
})
export class ModalFormProperty {
    private addressService = inject(AddressService);
    private analysisService = inject(AnalysisService);
    private router = inject(Router);
    isOpen = input(false);
    closed = output<void>();
    readonly step = signal(0);

    readonly query = signal('');
    readonly addresses = signal<any[]>([]);

    form = {
        adresse: '',
        ville: '',
        codePostal: '',
        latitude: null as number | null,
        longitude: null as number | null,
        type: '',
        surface: null as number | null,
        pieces: null as number | null,
        prix: null as number | null,
        etat: '',
        etage: null as number | null,
        balcon: false,
        parking: false,
        sourceSite: '',
        dpe: '',
    };

    constructor() {
        toObservable(this.query)
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                filter((q) => q.trim().length >= 3),
                switchMap((q) =>
                    this.addressService.search(q).pipe(catchError(() => of({ features: [] }))),
                ),
            )
            .subscribe((result: any) => {
                this.addresses.set(result.features);
            });
    }

    next() {
        if (this.step() < 3) this.step.update((v) => v + 1);
    }

    back() {
        if (this.step() > 0) this.step.update((v) => v - 1);
    }

    close() {
        this.step.set(0);
        this.closed.emit();
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
        const analysis: ManualAnalysis = {
            adresse: this.form.adresse,
            ville: this.form.ville,
            codePostal: this.form.codePostal,
            latitude: this.form.latitude!,
            longitude: this.form.longitude!,
            type: this.form.type,
            surface: this.form.surface!,
            pieces: this.form.pieces!,
            prix: this.form.prix!,
            etage: this.form.etage,
            etat: this.form.etat,
            balcon: this.form.balcon,
            parking: this.form.parking,
            sourceSite: this.form.sourceSite,
            dpe: this.form.dpe,
        };

        // 🔥 STORE GLOBAL TEMPORAIRE
        this.analysisService.manualAnalysis.set(analysis);

        // 🔥 NAVIGATION AVEC PARAM
        this.router.navigate(['/analyze-processing'], {
            queryParams: { isManual: true },
        });
    }
}
