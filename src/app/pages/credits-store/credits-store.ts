import { Component } from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CreditService } from '../../core/services/credit/credit';

@Component({
    selector: 'app-credits-store',
    imports: [Sidebar, CurrencyPipe],
    templateUrl: './credits-store.html',
    styleUrl: './credits-store.scss',
})
export class CreditsStore {
    creditPackages = [
        {
            id: 'starter',
            name: 'Starter',
            credits: 2,
            price: 4.99,
            img: '/images/packs/starter.png',
            tag: 'Pour commencer',
            description:
                'Découvrez Apprexia et réalisez vos deux premières analyses immobilières.',
            popular: false,
        },
        {
            id: 'discovery',
            name: 'Découverte',
            credits: 5,
            price: 8.99,
            img: '/images/packs/decouverte.png',
            tag: 'Premier investissement',
            description:
                'Analysez vos premiers biens et découvrez le potentiel réel d’une opportunité immobilière.',
            popular: false,
        },
        {
            id: 'investor',
            name: 'Investisseur',
            credits: 15,
            price: 24.99,
            img: '/images/packs/investisseur.png',
            tag: 'Le plus choisi',
            description:
                'Comparez plusieurs biens et prenez vos décisions avec une analyse complète Apprexia.',
            popular: true,
        },
        {
            id: 'expert',
            name: 'Expert',
            credits: 40,
            price: 59.99,
            img: '/images/packs/expert.png',
            tag: 'Investisseur actif',
            description:
                'Analysez régulièrement le marché immobilier et saisissez les meilleures opportunités.',
            popular: false,
        },
    ];

    constructor(
        private router: Router,
        private creditService: CreditService,
    ) {}

    buy(packageId: string) {
        this.creditService.createCheckout(packageId).subscribe({
            next: (response) => {
                console.log(response);
                window.location.href = response.checkoutUrl;
            },
        });
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
