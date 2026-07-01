import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class CreditService {
    private api = 'http://localhost:3000/credits';

    constructor(private http: HttpClient) {}

    createCheckout(packageId: string) {
        console.log(packageId);
        return this.http.post<{
            checkoutUrl: string;
        }>(`${this.api}/checkout`, {
            packageId,
        });
    }

    confirmPayment(sessionId: string) {
        return this.http.post(
            `${this.api}/confirm`,
            {
                sessionId,
            }
        );
    }
}
