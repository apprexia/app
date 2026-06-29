import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {
    protected opened = signal(false);

    constructor(private router: Router) {}

    toggleSidebar(): void {
        this.opened.update((v) => !v);
    }

    closeSidebar(): void {
        this.opened.set(false);
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
