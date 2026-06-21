import {
    Component,
    Input,
    OnInit,
    signal,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Sidebar } from '../layout/sidebar/sidebar';
import { ModalError } from '../modal/modal-error/modal-error';

import { AnalysisService } from '../core/services/analysis';
import { Analysis } from '../core/models/analysis.model';

import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-analysis-result',
    templateUrl: './analysis-result.html',
    styleUrl: './analysis-result.scss',
    imports: [
        Sidebar,
        ModalError,
        CurrencyPipe,
    ],
})
export class AnalysisResult implements OnInit {

    @Input() isOpen = false;

    readonly analysis = signal<Analysis | null>(null);

    constructor(
        private route: ActivatedRoute,
        private analysisService: AnalysisService,
        private router: Router,
    ) {}

    ngOnInit() {

        this.route.paramMap.subscribe((params) => {

            const id = params.get('id');

            if (!id) {
                return;
            }

            this.analysisService.findOne(id).subscribe({

                next: (analysis) => {
                    this.analysis.set(analysis);
                },

                error: (err) => {
                    console.error(err);
                },
            });
        });
    }

    logout() {
        this.router.navigate(['/login']);
        this.isOpen = true;
    }

    protected readonly isFinite = isFinite;
}
