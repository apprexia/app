import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CreditService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    createCheckout(packageId: string) {
        return this.http.post<{
            checkoutUrl: string;
        }>(`${this.apiUrl}/credits/checkout`, {
            packageId,
        });
    }

    confirmPayment(sessionId: string) {
        return this.http.post(
            `${this.apiUrl}/credits/confirm`,
            {
                sessionId,
            }
        );
    }
}
