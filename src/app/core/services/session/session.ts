import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface JwtPayload {
    sub: string;
    email: string;
    name?: string;
    avatar?: string;
    role?: 'USER' | 'ADMIN';
    exp?: number;
    iat?: number;
}

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private platformId = inject(PLATFORM_ID);

    private getToken(): string | null {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }

        return localStorage.getItem('token');
    }

    private decodeToken(): JwtPayload | null {
        const token = this.getToken();

        if (!token) {
            return null;
        }

        try {
            const payload = token.split('.')[1];

            const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

            return decoded;
        } catch {
            return null;
        }
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getUser(): JwtPayload | null {
        return this.decodeToken();
    }

    isAdmin(): boolean {
        return this.decodeToken()?.role === 'ADMIN';
    }

    logout(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        localStorage.removeItem('token');
    }
}
