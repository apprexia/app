import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../../core/services/session/session';

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {

    private session = inject(SessionService);

    protected opened = signal(false);

    protected collapsed = signal(false);

    constructor(private router: Router) {
    }

    isAuthenticated(): boolean {
        return this.session.isAuthenticated();
    }

    isAdmin(): boolean {
        return this.session.isAdmin();
    }

    toggleSidebar(): void {
        this.opened.update((v) => !v);
    }

    closeSidebar(): void {
        this.opened.set(false);
    }

    toggleCollapsed(): void {
        this.collapsed.update((v) => !v);
    }

    logout(): void {
        this.session.logout();
        this.router.navigate(['/login']);
    }
}
