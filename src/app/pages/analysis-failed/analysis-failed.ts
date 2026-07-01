import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
    selector: 'app-analysis-failed',
    imports: [RouterLink, Sidebar],
    templateUrl: './analysis-failed.html',
    styleUrl: './analysis-failed.scss',
})
export class AnalysisFailed {
    constructor(private router: Router) {}

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
