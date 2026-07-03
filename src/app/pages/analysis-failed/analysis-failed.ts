import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { ModalFormProperty } from '../../modal/modal-form-property/modal-form-property';

@Component({
    selector: 'app-analysis-failed',
    imports: [RouterLink, Sidebar, ModalFormProperty],
    templateUrl: './analysis-failed.html',
    styleUrl: './analysis-failed.scss',
})
export class AnalysisFailed {
    isOpen = false;

    constructor(private router: Router) {}

    openModal() {
        this.isOpen = true;
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
