import { Component, OnInit, signal } from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CreditService } from '../../core/services/credit/credit';

@Component({
    selector: 'app-credits-success',
    imports: [Sidebar, RouterLink],
    templateUrl: './credits-success.html',
    styleUrl: './credits-success.scss',
})
export class CreditsSuccess implements OnInit {
    creditsAdded = signal(0);
    paymentConfirmed = signal(false);

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private creditService: CreditService,
    ) {}

    ngOnInit() {
        const sessionId = this.route.snapshot.queryParamMap.get('session_id');

        if (!sessionId) {
            this.router.navigate(['/credits']);
            return;
        }

        this.creditService.confirmPayment(sessionId).subscribe({
            next: (response: any) => {
                this.creditsAdded.set(response.credits);
                this.paymentConfirmed.set(true);
            },

            error: () => {
                this.router.navigate(['/credits']);
            },
        });
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
