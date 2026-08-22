import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService, AdminUserDetailResponse } from '../services/admin/admin';

@Component({
    selector: 'app-admin-user-detail',
    imports: [DatePipe, DecimalPipe, RouterLink],
    templateUrl: './admin-user-detail.html',
    styleUrl: './admin-user-detail.scss',
})
export class AdminUserDetail implements OnInit {
    private adminService = inject(AdminService);
    private route = inject(ActivatedRoute);

    protected user = signal<AdminUserDetailResponse | null>(null);
    protected loading = signal(true);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            this.loading.set(false);
            return;
        }

        this.loadUser(id);
    }

    private loadUser(id: string): void {
        this.loading.set(true);

        this.adminService.getUserById(id).subscribe({
            next: (response) => {
                this.user.set(response);
                this.loading.set(false);
            },

            error: (error) => {
                console.error('Erreur détail utilisateur:', error);

                this.user.set(null);
                this.loading.set(false);
            },
        });
    }
}
