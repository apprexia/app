import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { DatePipe } from '@angular/common';

import { AdminAnalysisModel, AdminService } from '../services/admin/admin';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-analyses',

    imports: [DatePipe],

    templateUrl: './admin-analyses.html',

    styleUrl: './admin-analyses.scss',
})
export class AdminAnalyses implements OnInit {
    private adminService = inject(AdminService);
    private readonly router = inject(Router);

    // =====================================================
    // DATA
    // =====================================================

    protected analyses = signal<AdminAnalysisModel[]>([]);

    protected loading = signal(true);

    // =====================================================
    // PAGINATION
    // =====================================================

    protected page = signal(1);

    protected limit = signal(10);

    protected total = signal(0);

    protected totalPages = signal(0);

    // =====================================================
    // SEARCH
    // =====================================================

    protected search = signal('');

    protected filteredAnalyses = computed(() => {
        // La recherche est maintenant effectuée côté backend.
        // On retourne simplement les analyses reçues.

        return this.analyses();
    });

    // =====================================================
    // SOURCE LOGOS
    // =====================================================

    protected getSourceLogo(sourceSite?: string | null): string | null {
        if (!sourceSite) {
            return null;
        }

        const source = sourceSite.toLowerCase().trim();

        const logos: Record<string, string> = {
            orpi: 'images/logos/orpi.png',

            leboncoin: 'images/logos/leboncoin.png',

            logicimmo: 'images/logos/logicimmo.png',

            seloger: 'images/logos/seloger.png',

            ladresse: 'images/logos/ladresse.png',

            pap: 'images/logos/pap.png',

            figaroimmobilier: 'images/logos/figaroimmobilier.png',

            paruvendu: 'images/logos/paruvendu.png',

            guyhoquet: 'images/logos/guyhoquet.png',

            century21: 'images/logos/century21.png',
        };

        return logos[source] ?? null;
    }

    // =====================================================
    // INIT
    // =====================================================

    ngOnInit(): void {
        this.loadAnalyses();
    }

    openAnalysis(analysisId: string): void {
        this.router.navigate(['/analyze-result', analysisId]);
    }

    // =====================================================
    // LOAD
    // =====================================================

    private loadAnalyses(): void {
        this.loading.set(true);

        const search = this.search().trim().toLowerCase();

        this.adminService.getAnalyses(this.page(), this.limit(), search).subscribe({
            next: (response) => {
                console.log('ADMIN ANALYSES RESPONSE:', response);

                this.analyses.set(response.data);

                this.total.set(response.pagination.total);

                this.totalPages.set(response.pagination.totalPages);

                this.loading.set(false);
            },

            error: (error) => {
                console.error('Erreur analyses admin:', error);

                this.loading.set(false);
            },
        });
    }

    // =====================================================
    // SEARCH
    // =====================================================

    protected onSearch(value: string): void {
        this.search.set(value);

        this.page.set(1);

        this.loadAnalyses();
    }

    // =====================================================
    // PAGINATION
    // =====================================================

    protected goToPage(page: number): void {
        if (page < 1 || page > this.totalPages()) {
            return;
        }

        this.page.set(page);

        this.loadAnalyses();
    }

    protected nextPage(): void {
        this.goToPage(this.page() + 1);
    }

    protected previousPage(): void {
        this.goToPage(this.page() - 1);
    }
}
