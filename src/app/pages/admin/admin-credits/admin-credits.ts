import { Component, OnInit, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    AdminCreditsOverview,
    AdminCreditTransaction,
    AdminService,
} from '../services/admin/admin';

@Component({
    selector: 'app-admin-credits',

    standalone: true,

    imports: [CommonModule, FormsModule],

    templateUrl: './admin-credits.html',
    styleUrl: './admin-credits.scss',
})
export class AdminCredits implements OnInit {
    private readonly adminService = inject(AdminService);

    /* =========================================================
       STATE
    ========================================================= */

    loading = signal(true);

    transactionsLoading = signal(true);

    overview = signal<AdminCreditsOverview | null>(null);

    transactions = signal<AdminCreditTransaction[]>([]);

    search = signal('');

    transactionSearch = signal('');

    transactionPage = signal(1);

    transactionTotalPages = signal(1);

    transactionTotal = signal(0);

    /* =========================================================
       MODAL
    ========================================================= */

    showCreditModal = signal(false);

    selectedUser = signal<any | null>(null);

    creditAmount = signal<number>(1);

    creditDescription = signal('');

    /* =========================================================
       INIT
    ========================================================= */

    ngOnInit() {
        this.loadOverview();

        this.loadTransactions();
    }

    /* =========================================================
       OVERVIEW
    ========================================================= */

    loadOverview() {
        this.loading.set(true);

        this.adminService.getCreditsOverview().subscribe({
            next: (data) => {
                this.overview.set(data);

                this.loading.set(false);
            },

            error: (error) => {
                console.error('Erreur chargement crédits', error);

                this.loading.set(false);
            },
        });
    }

    /* =========================================================
       TRANSACTIONS
    ========================================================= */

    loadTransactions() {
        this.transactionsLoading.set(true);

        this.adminService
            .getCreditTransactions(this.transactionPage(), 20, this.transactionSearch())
            .subscribe({
                next: (data) => {
                    this.transactions.set(data.transactions);

                    this.transactionTotal.set(data.pagination.total);

                    this.transactionTotalPages.set(data.pagination.totalPages);

                    this.transactionsLoading.set(false);
                },

                error: (error) => {
                    console.error('Erreur chargement transactions', error);

                    this.transactionsLoading.set(false);
                },
            });
    }

    /* =========================================================
       SEARCH USERS
    ========================================================= */

    filteredUsers() {
        const data = this.overview()?.users ?? [];

        const term = this.search().trim().toLowerCase();

        if (!term) {
            return data;
        }

        return data.filter(
            (user) =>
                user.email.toLowerCase().includes(term) || user.name?.toLowerCase().includes(term),
        );
    }

    /* =========================================================
       TRANSACTION SEARCH
    ========================================================= */

    onTransactionSearch() {
        this.transactionPage.set(1);

        this.loadTransactions();
    }

    /* =========================================================
       PAGINATION
    ========================================================= */

    previousTransactionPage() {
        if (this.transactionPage() <= 1) {
            return;
        }

        this.transactionPage.update((page) => page - 1);

        this.loadTransactions();
    }

    nextTransactionPage() {
        if (this.transactionPage() >= this.transactionTotalPages()) {
            return;
        }

        this.transactionPage.update((page) => page + 1);

        this.loadTransactions();
    }

    /* =========================================================
       CREDIT MODAL
    ========================================================= */

    openCreditModal(user: any) {
        this.selectedUser.set(user);

        this.creditAmount.set(1);

        this.creditDescription.set('');

        this.showCreditModal.set(true);
    }

    closeCreditModal() {
        this.showCreditModal.set(false);

        this.selectedUser.set(null);
    }

    /* =========================================================
       UPDATE CREDITS
    ========================================================= */

    submitCreditUpdate() {
        const user = this.selectedUser();

        if (!user) {
            return;
        }

        const amount = Number(this.creditAmount());

        const description = this.creditDescription().trim();

        if (!Number.isInteger(amount)) {
            return;
        }

        if (amount === 0) {
            return;
        }

        if (!description) {
            return;
        }

        this.adminService.updateUserCredits(user.id, amount, description).subscribe({
            next: () => {
                this.closeCreditModal();

                this.loadOverview();

                this.loadTransactions();
            },

            error: (error) => {
                console.error('Erreur modification crédits', error);
            },
        });
    }

    /* =========================================================
       HELPERS
    ========================================================= */

    getInitials(name: string | null, email: string) {
        if (name?.trim()) {
            return name
                .trim()
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
        }

        return email.charAt(0).toUpperCase();
    }

    getTransactionClass(amount: number) {
        if (amount > 0) {
            return 'positive';
        }

        if (amount < 0) {
            return 'negative';
        }

        return '';
    }

    getTransactionLabel(type: string) {
        switch (type) {
            case 'WELCOME':
                return 'Bienvenue';

            case 'ANALYSIS':
                return 'Analyse';

            case 'PURCHASE':
                return 'Achat';

            case 'REFUND':
                return 'Remboursement';

            case 'ADMIN':
                return 'Administration';

            default:
                return type;
        }
    }
}
