import { Component } from '@angular/core';
import { ModalFormProperty } from '../../modal/modal-form-property/modal-form-property';
import { Router, RouterLink } from '@angular/router';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
    selector: 'app-analysis-unsupported',
    imports: [ModalFormProperty, RouterLink, Sidebar],
    templateUrl: './analysis-unsupported.html',
    styleUrl: './analysis-unsupported.scss',
})
export class AnalysisUnsupported {
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
