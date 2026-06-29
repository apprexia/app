import {
    ChangeDetectorRef,
    Component,
    computed,
    ElementRef,
    inject,
    OnInit,
    PLATFORM_ID,
    signal,
    ViewChild,
} from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Router, RouterLink } from '@angular/router';
import { AnalysisService } from '../../core/services/analysis/analysis';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Analysis } from '../../core/models/analysis.model';
import { FavoriteService } from '../../core/services/favorite/favorite';

@Component({
    selector: 'app-analysis-list',
    imports: [Sidebar, RouterLink, CurrencyPipe],
    templateUrl: './analysis-list.html',
    styleUrl: './analysis-list.scss',
})
export class AnalysisList implements OnInit {
    @ViewChild('mainContent')
    private mainContent!: ElementRef<HTMLElement>;
    private platformId = inject(PLATFORM_ID);
    currentPage = 1;

    totalPages = 1;

    limit = 9;

    categories: string[] = ['Toutes', 'INVESTIR', 'NÉGOCIER', 'ÉVITER'];
    readonly analyses = signal<Analysis[]>([]);

    readonly selectedCategory = signal('Toutes');

    readonly filteredAnalyses = computed(() => {
        if (this.selectedCategory() === 'Toutes') {
            return this.analyses();
        }

        return this.analyses().filter((analysis) => analysis.verdict === this.selectedCategory());
    });

    constructor(
        private analysisService: AnalysisService,
        private favoriteService: FavoriteService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.loadAnalyses();
        this.loadFavorites();
    }

    loadAnalyses() {
        this.analysisService.findAll(this.currentPage, this.limit).subscribe({
            next: (response) => {
                this.analyses.set(response.data);
                this.totalPages = response.totalPages;

                setTimeout(() => {
                    if (!isPlatformBrowser(this.platformId)) {
                        return;
                    }

                    this.mainContent?.nativeElement.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });
                }, 500);
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

    loadFavorites() {
        this.favoriteService.loadFavorites().subscribe();
    }

    toggleFavorite(id: string) {
        this.favoriteService.toggleFavorite(id).subscribe();
    }

    isFavorite(id: string): boolean {
        return this.favoriteService.isFavorite(id);
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
