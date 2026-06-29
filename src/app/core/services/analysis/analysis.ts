import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Analysis } from '../../models/analysis.model';
import { PaginatedResponse } from '../../models/paginated-response.model';

@Injectable({
    providedIn: 'root',
})
export class AnalysisService {
    private http = inject(HttpClient);

    private apiUrl = 'http://localhost:3000';

    create(url: string) {
        return this.http.post<Analysis>(`${this.apiUrl}/analyses`, {
            url,
        });
    }

    getStatus(id: string) {
        return this.http.get<{
            id: string;
            status: string;
        }>(
            `${this.apiUrl}/analyses/${id}/status`,
        );
    }

    findAll(page = 1, limit = 10) {
        return this.http.get<PaginatedResponse<Analysis>>(
            `${this.apiUrl}/analyses?page=${page}&limit=${limit}`,
        );
    }

    findOne(id: string) {
        return this.http.get<Analysis>(`${this.apiUrl}/analyses/${id}`);
    }
}
