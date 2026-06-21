import { ChangeDetectorRef, Component, computed, OnInit, signal } from '@angular/core';
import { Sidebar } from '../layout/sidebar/sidebar';
import { RouterLink } from '@angular/router';
import { AnalysisService } from '../core/services/analysis';
import { CurrencyPipe } from '@angular/common';
import { Analysis } from '../core/models/analysis.model';

@Component({
    selector: 'app-analysis-list',
    imports: [Sidebar, RouterLink, CurrencyPipe],
    templateUrl: './analysis-list.html',
    styleUrl: './analysis-list.scss',
})
export class AnalysisList implements OnInit {
    currentPage = 1;

    totalPages = 1;

    limit = 10;

    categories: string[] = ['Toutes', 'INVESTIR', 'NÉGOCIER', 'ÉVITER'];
    readonly analyses = signal<Analysis[]>([]);

    readonly selectedCategory = signal('Toutes');

    readonly filteredAnalyses = computed(() => {

        if (this.selectedCategory() === 'Toutes') {
            return this.analyses();
        }

        return this.analyses().filter(
            analysis => analysis.verdict === this.selectedCategory(),
        );
    });

    constructor(
        private analysisService: AnalysisService,
    ) {}

    ngOnInit() {
        this.loadAnalyses();
    }

    loadAnalyses() {
        this.analysisService.findAll(this.currentPage, this.limit).subscribe({
            next: (response) => {
                this.analyses.set(response.data);
                this.totalPages = response.totalPages;
            },

            error: console.error,
        });
    }

    setCategory(category: string) {
        this.selectedCategory.set(category);
    }

    goToPage(page: number) {
        if (page < 1 || page > this.totalPages) {
            return;
        }

        this.currentPage = page;
        this.loadAnalyses();
    }
}
