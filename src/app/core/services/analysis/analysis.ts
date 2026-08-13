import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Analysis } from '../../models/analysis.model';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { ManualAnalysis } from '../../models/manual-analysis.model';
import { environment } from '../../../../environments/environment';
import { LinkPreviewMetadata } from '../../models/link-preview-metadata';

@Injectable({
    providedIn: 'root',
})
export class AnalysisService {
    readonly manualAnalysis = signal<ManualAnalysis | null>(null);
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    create(url: string, device: 'mobile' | 'desktop', linkPreview?: LinkPreviewMetadata) {
        return this.http.post<Analysis>(`${this.apiUrl}/analyses`, {
            url,
            device,
            linkPreview,
        });
    }

    getLinkPreview(url: string) {
        return this.http.get<LinkPreviewMetadata>('https://api.linkpreview.net', {
            params: {
                key: environment.linkPreviewApiKey,
                q: url,
            },
        });
    }

    isLeboncoinUrl(url: string): boolean {
        try {
            const hostname = new URL(url).hostname.toLowerCase();

            return hostname === 'leboncoin.fr' || hostname.endsWith('.leboncoin.fr');
        } catch {
            return false;
        }
    }

    createManual(data: ManualAnalysis) {
        return this.http.post<{ id: string }>(`${this.apiUrl}/analyses/manual`, data);
    }

    getStatus(id: string) {
        return this.http.get<{
            id: string;
            status: string;
        }>(`${this.apiUrl}/analyses/${id}/status`);
    }

    findAll(page = 1, limit = 10, verdict?: string) {
        let url =
            `${this.apiUrl}/analyses` + `?page=${page}` + `&limit=${limit}` + `&status=COMPLETED`;

        if (verdict) {
            url += `&verdict=${encodeURIComponent(verdict)}`;
        }

        return this.http.get<PaginatedResponse<Analysis>>(url);
    }

    findOne(id: string) {
        return this.http.get<Analysis>(`${this.apiUrl}/analyses/${id}`);
    }

    downloadReport(id: string) {
        return this.http.get(`${this.apiUrl}/report/${id}/report`, {
            responseType: 'blob',
        });
    }
}
