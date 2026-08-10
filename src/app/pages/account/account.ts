import { Component, OnInit, signal } from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user/user';
import { UserProfile } from '../../core/models/user.model';

@Component({
    selector: 'app-account',
    imports: [Sidebar],
    templateUrl: './account.html',
    styleUrl: './account.scss',
})
export class Account implements OnInit {
    user = signal<UserProfile | null>(null);

    constructor(
        private userService: UserService,
        private router: Router,
    ) {}

    get welcomeLabel(): string {
        const hour = new Date().getHours();

        return hour >= 18 ? 'Bonsoir' : 'Bonjour';
    }

    ngOnInit() {
        this.getMe();
    }

    getMe() {
        this.userService.getMe().subscribe({
            next: (user: UserProfile) => {
                this.user.set(user);
            },

            error: (error) => {
                console.error('Erreur récupération profil', error);
            },
        });
    }

    logout() {
        localStorage.removeItem('token');

        this.router.navigate(['/login']);
    }

    /**
     * Total des verdicts
     */
    getTotalVerdicts(profile: UserProfile): number {
        return (
            (profile.stats.investir || 0) +
            (profile.stats.favorable || 0) +
            (profile.stats.negocier || 0) +
            (profile.stats.eviter || 0)
        );
    }

    /**
     * Pourcentage d'un verdict
     */
    getVerdictPercentage(value: number): number {
        const profile = this.user();

        if (!profile) {
            return 0;
        }

        const total = this.getTotalVerdicts(profile);

        if (total === 0) {
            return 0;
        }

        return Math.round((value / total) * 100);
    }

    /**
     * Hauteur des barres
     */
    getBarHeight(value: number): number {
        const profile = this.user();

        if (!profile) {
            return 0;
        }

        const values = [
            profile.stats.investir || 0,
            profile.stats.negocier || 0,
            profile.stats.favorable || 0,
            profile.stats.eviter || 0,
        ];

        const max = Math.max(...values);

        if (max === 0) {
            return 0;
        }

        return Math.max(15, (value / max) * 100);
    }
}
