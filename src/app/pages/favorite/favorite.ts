import {
    Component,
    computed,
    ElementRef,
    inject,
    OnInit,
    PLATFORM_ID,
    signal,
    ViewChild,
} from '@angular/core';

import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Sidebar } from '../../layout/sidebar/sidebar';

import { Analysis } from '../../core/models/analysis.model';
import { FavoriteService } from '../../core/services/favorite/favorite';

@Component({
    selector: 'app-favorite',
    imports: [CurrencyPipe, RouterLink, Sidebar],
    templateUrl: './favorite.html',
    styleUrl: './favorite.scss',
})
export class Favorite implements OnInit {
    @ViewChild('mainContent')
    private mainContent!: ElementRef;

    private platformId = inject(PLATFORM_ID);

    currentPage = 1;

    totalPages = 1;

    limit = 9;

    categories: string[] = ['TOUTES', 'INVESTIR', 'NEGOCIER', 'EVITER'];

    readonly favorites = signal<Analysis[]>([]);

    readonly selectedCategory = signal('TOUTES');

    readonly filteredAnalyses = computed(() => {
        if (this.selectedCategory() === 'TOUTES') {
            return this.favorites();
        }

        return this.favorites().filter((analysis) => analysis.verdict === this.selectedCategory());
    });

    constructor(
        private router: Router,
        private favoriteService: FavoriteService,
    ) {}

    ngOnInit() {
        this.loadFavorites();
    }

    /**
     * Charge uniquement les biens favoris
     */
    loadFavorites() {
        this.favoriteService.getFavoriteAnalyses(this.currentPage, this.limit).subscribe({
            next: (response) => {
                this.favorites.set(response.data);

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

        this.loadFavorites();
    }

    toggleFavorite(id: string) {
        this.favoriteService.toggleFavorite(id).subscribe({
            next: () => {
                // recharge uniquement les favoris
                this.loadFavorites();
            },

            error: console.error,
        });
    }

    isFavorite(id: string): boolean {
        return this.favoriteService.isFavorite(id);
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
