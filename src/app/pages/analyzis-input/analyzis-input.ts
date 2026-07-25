import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalError } from '../../modal/modal-error/modal-error';
import { ModalFormProperty } from '../../modal/modal-form-property/modal-form-property';
import { ModalService } from '../../core/services/modal/modal';

@Component({
    selector: 'app-analyzis-input',
    imports: [RouterLink, FormsModule, ModalError, ModalFormProperty],
    templateUrl: './analyzis-input.html',
    styleUrl: './analyzis-input.scss',
})
export class AnalyzisInput {
    modalService = inject(ModalService);
    url = '';
    loading = false;
    isOpenForm = false;
    isOpen = this.modalService.isOpen;
    titleError = this.modalService.title;
    messageError = this.modalService.message;

    constructor(private router: Router) {}

    openModalForm() {
        this.isOpenForm = true;
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
