import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminDashboardModel, AdminService } from '../services/admin/admin';

@Component({
    selector: 'app-admin-dashboard',
    imports: [RouterLink],
    templateUrl: './admin-dashboard.html',
    styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
    private adminService = inject(AdminService);

    protected dashboard = signal<AdminDashboardModel | null>(null);
    protected loading = signal(true);

    ngOnInit(): void {
        this.adminService.getDashboard().subscribe({
            next: (data) => {
                this.dashboard.set(data);
                this.loading.set(false);
            },

            error: (error) => {
                console.error('Erreur dashboard admin:', error);
                this.loading.set(false);
            },
        });
    }
}
