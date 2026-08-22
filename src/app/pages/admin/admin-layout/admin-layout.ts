import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-admin-layout',
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: './admin-layout.html',
    styleUrl: './admin-layout.scss',
})
export class AdminLayout {
    protected opened = signal(false);
    protected collapsed = signal(false);

    constructor(private router: Router) {}

    toggleSidebar(): void {
        this.opened.update((value) => !value);
    }

    closeSidebar(): void {
        this.opened.set(false);
    }

    toggleCollapsed(): void {
        this.collapsed.update((value) => !value);
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

    backToApp(): void {
        this.router.navigate(['/']);
    }
}
