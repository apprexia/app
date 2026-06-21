import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AnalysisService } from '../core/services/analysis';
import { FormsModule } from '@angular/forms';
import { ModalError } from '../modal/modal-error/modal-error';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-analyzis-input',
    imports: [RouterLink, FormsModule, ModalError],
    templateUrl: './analyzis-input.html',
    styleUrl: './analyzis-input.scss',
})
export class AnalyzisInput {
    url = '';
    loading = false;
    isOpen = false;

    constructor(
        private analysisService: AnalysisService,
        private router: Router,
    ) {}

    openModal() {
        this.isOpen = true;
    }

    closeModal() {
        this.isOpen = false;
    }

    submit() {
        if (!this.url.trim()) {
            return;
        }

        this.router.navigate(['/analyze-processing'], {
            state: {
                url: this.url,
            },
        });
    }
}
