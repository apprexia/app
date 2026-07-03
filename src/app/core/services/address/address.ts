import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AddressService {
    private http = inject(HttpClient);

    search(query: string): Observable<any> {
        return this.http.get(
            `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`,
        );
    }
}
