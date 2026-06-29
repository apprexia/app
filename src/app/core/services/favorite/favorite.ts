import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FavoriteService {
    private favorites = signal<string[]>([]);

    private apiUrl = 'http://localhost:3000/favorites';

    constructor(private http: HttpClient) {}

    loadFavorites() {
        return this.http.get<{ analysisId: string }[]>(`${this.apiUrl}`).pipe(
            tap((data) => {
                this.favorites.set(data.map((f) => f.analysisId));
            }),
        );
    }

    getFavoriteAnalyses(page: number, limit: number) {
        return this.http.get<any>(`${this.apiUrl}/with-analyses?page=${page}&limit=${limit}`);
    }

    toggleFavorite(id: string) {
        return this.http.post<{ favorite: boolean }>(`${this.apiUrl}/${id}`, {}).pipe(
            tap((response) => {
                const current = this.favorites();

                if (response.favorite) {
                    this.favorites.set([...current, id]);
                } else {
                    this.favorites.set(current.filter((fav) => fav !== id));
                }
            }),
        );
    }

    isFavorite(id: string) {
        return this.favorites().includes(id);
    }

    getFavoriteIds() {
        return this.favorites();
    }
}
