import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface AdminDashboardModel {
    users: {
        total: number;
    };

    analyses: {
        total: number;
        completed: number;
        failed: number;
    };

    credits: {
        total: number;
    };
}

export interface AdminUserModel {
    id: string;
    email: string;
    name: string | null;
    role: string;
    credits: number;
    createdAt: string;

    _count: {
        analyses: number;
    };
}

export interface AdminUserDetailModel {
    id: string;
    name: string | null;
    email: string;
    role: string;
    credits: number;

    stats: {
        analyses: number;
        completed: number;
        failed: number;
    };

    createdAt: string;
}

export interface AdminAnalysisModel {
    id: string;

    user: {
        id: string;
        name: string | null;
        email: string;
    };

    sourceSite: string | null;

    property: {
        title: string | null;
        typeLocal: string | null;
        city: string | null;
        codePostal: string | null;
        surface: number | null;
        askingPrice: number | null;
    };

    score: number | null;

    verdict: string | null;

    status: string;

    createdAt: string;
}

export interface AdminAnalysesResponse {
    data: AdminAnalysisModel[];

    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface AdminAnalysesResponse {
    data: AdminAnalysisModel[];

    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface AdminUserDetailResponse {
    user: {
        id: string;
        email: string;
        name: string | null;
        role: string;
        credits: number;
        createdAt: string;
    };

    statistics: {
        analyses: number;
        completed: number;
        failed: number;
        pending: number;
    };

    recentAnalyses: {
        id: string;
        sourceSite: string | null;
        title: string | null;
        city: string | null;
        codePostal: string | null;
        typeLocal: string | null;
        surface: number | null;
        askingPrice: number | null;
        score: number | null;
        verdict: string | null;
        status: string;
        createdAt: string;
    }[];

    creditTransactions: {
        id: string;
        amount: number;
        type: string;
        description: string | null;
        createdAt: string;
    }[];
}

export interface AdminCreditUser {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    credits: number;
    createdAt: string;
    _count: { analyses: number; transactions: number };
}

export interface AdminCreditsStats {
    totalCredits: number;
    totalPurchased: number;
    totalUsed: number;
    totalRefunded: number;
    totalAdmin: number;
    totalUsers: number;
}

export interface AdminCreditsOverview {
    stats: AdminCreditsStats;
    users: AdminCreditUser[];
}

export interface AdminCreditTransaction {
    id: string;
    userId: string;
    amount: number;
    type: 'WELCOME' | 'ANALYSIS' | 'PURCHASE' | 'REFUND' | 'ADMIN';
    packageId: string | null;
    description: string | null;
    createdAt: string;
    user: { id: string; email: string; name: string | null; avatar: string | null };
}

export interface AdminCreditTransactionsResponse {
    transactions: AdminCreditTransaction[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
}

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    private http = inject(HttpClient);

    getDashboard(): Observable<AdminDashboardModel> {
        return this.http.get<AdminDashboardModel>(`${environment.apiUrl}/admin/dashboard`);
    }

    getUsers(): Observable<AdminUserModel[]> {
        return this.http.get<AdminUserModel[]>(`${environment.apiUrl}/admin/users`);
    }

    getUserById(id: string): Observable<AdminUserDetailResponse> {
        return this.http.get<AdminUserDetailResponse>(`${environment.apiUrl}/admin/users/${id}`);
    }

    getAnalyses(page = 1, limit = 10, search = ''): Observable<AdminAnalysesResponse> {
        return this.http.get<AdminAnalysesResponse>(`${environment.apiUrl}/admin/analyses`, {
            params: {
                page,
                limit,
                search,
            },
        });
    }

    getCreditsOverview() {
        return this.http.get<AdminCreditsOverview>(`${environment.apiUrl}/admin/credits`);
    }

    getCreditTransactions(page = 1, limit = 20, search = '') {
        const params: any = { page, limit };
        if (search.trim()) {
            params.search = search.trim();
        }
        return this.http.get<AdminCreditTransactionsResponse>(
            `${environment.apiUrl}/admin/credits/transactions`,
            { params },
        );
    }

    updateUserCredits(userId: string, amount: number, description: string) {
        return this.http.post(`${environment.apiUrl}/admin/credits/${userId}`, { amount, description });
    }
}
