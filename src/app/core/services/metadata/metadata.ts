import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface LinkPreview {
    url: string;
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
}

@Injectable({
    providedIn: 'root',
})
export class MetadataService {
    private readonly http = inject(HttpClient);

    private apiUrl = environment.apiUrl;


    getPreview(url: string): Observable<LinkPreview> {
        return this.http.post<LinkPreview>(`${this.apiUrl}/metadata-preview/preview`, { url });
    }
}
