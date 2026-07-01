import { Component } from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-credits-cancel',
    imports: [Sidebar, RouterLink],
    templateUrl: './credits-cancel.html',
    styleUrl: './credits-cancel.scss',
})
export class CreditsCancel {
    constructor(private router: Router) {}

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
