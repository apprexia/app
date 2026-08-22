import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AdminService, AdminUserModel } from '../services/admin/admin';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-users',
    imports: [DatePipe],
    templateUrl: './admin-users.html',
    styleUrl: './admin-users.scss',
})
export class AdminUsers implements OnInit {
    private adminService = inject(AdminService);
    private router = inject(Router);
    protected users = signal<AdminUserModel[]>([]);
    protected loading = signal(true);
    protected search = signal('');
    protected filteredUsers = computed(() => {
        const query = this.search().trim().toLowerCase();

        if (!query) {
            return this.users();
        }

        return this.users().filter(
            (user) =>
                user.email.toLowerCase().includes(query) ||
                user.name?.toLowerCase().includes(query),
        );
    });

    ngOnInit(): void {
        this.adminService.getUsers().subscribe({
            next: (users) => {
                this.users.set(users);
                this.loading.set(false);
            },

            error: (error) => {
                console.error('Erreur utilisateurs admin:', error);

                this.loading.set(false);
            },
        });
    }

    protected openUser(userId: string): void {
        this.router.navigate(['/admin/users', userId]);
    }
}
