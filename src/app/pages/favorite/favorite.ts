import {
    Component,
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
import { NoContent } from '../../shared/components/no-content/no-content';

@Component({
    selector: 'app-favorite',
    imports: [CurrencyPipe, RouterLink, Sidebar, NoContent],
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

    categories: string[] = ['TOUTES', 'INVESTIR', 'FAVORABLE', 'NEGOCIER', 'EVITER'];

    readonly favorites = signal<Analysis[]>([]);

    readonly selectedCategory = signal('TOUTES');

    constructor(
        private router: Router,
        private favoriteService: FavoriteService,
    ) {}

    ngOnInit() {
        this.loadFavorites();
    }

    /**
     * Charge les favoris correspondant
     * à la catégorie sélectionnée et à la page courante.
     */
    loadFavorites() {
        const category = this.selectedCategory();

        const verdict = category === 'TOUTES' ? undefined : category;

        this.favoriteService.getFavoriteAnalyses(this.currentPage, this.limit, verdict).subscribe({
            next: (response) => {
                this.favorites.set(response.data);

                this.totalPages = response.totalPages;

                this.scrollToTop();
            },

            error: (error) => {
                console.error('Erreur lors du chargement des favoris :', error);
            },
        });
    }

    /**
     * Change de catégorie.
     *
     * Le changement de catégorie recharge les favoris
     * et revient automatiquement à la première page.
     */
    setCategory(category: string) {
        this.selectedCategory.set(category);

        this.currentPage = 1;

        this.loadFavorites();
    }

    /**
     * Change de page.
     */
    goToPage(page: number) {
        if (page < 1 || page > this.totalPages) {
            return;
        }

        this.currentPage = page;

        this.loadFavorites();
    }

    /**
     * Retire un favori puis recharge la liste.
     */
    toggleFavorite(id: string) {
        this.favoriteService.toggleFavorite(id).subscribe({
            next: () => {
                this.loadFavorites();
            },

            error: (error) => {
                console.error('Erreur lors de la modification du favori :', error);
            },
        });
    }

    /**
     * Vérifie si une analyse est dans les favoris.
     */
    isFavorite(id: string): boolean {
        return this.favoriteService.isFavorite(id);
    }

    /**
     * Remonte le contenu en haut.
     */
    private scrollToTop() {
        setTimeout(() => {
            if (!isPlatformBrowser(this.platformId)) {
                return;
            }

            this.mainContent?.nativeElement.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }, 100);
    }

    /**
     * Déconnexion.
     */
    logout() {
        localStorage.removeItem('token');

        this.router.navigate(['/login']);
    }
}
