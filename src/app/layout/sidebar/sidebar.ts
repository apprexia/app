import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {
    private platformId = inject(PLATFORM_ID);
    protected opened = signal(false);
    // Desktop : sidebar réduite ou développée
    protected collapsed = signal(false);

    constructor(private router: Router) {}

    isAuthenticated(): boolean {
        if (!isPlatformBrowser(this.platformId)) {
            return false;
        }

        return !!localStorage.getItem('token');
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
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
