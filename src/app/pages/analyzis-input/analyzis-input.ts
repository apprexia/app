import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalError } from '../../modal/modal-error/modal-error';
import { ModalFormProperty } from '../../modal/modal-form-property/modal-form-property';
import { ModalService } from '../../core/services/modal/modal';
import { Header } from '../../layout/header/header';

@Component({
    selector: 'app-analyzis-input',
    imports: [FormsModule, ModalError, ModalFormProperty, Header],
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

    // IMPORTANT
    isScrolled = signal(false);

    constructor(private router: Router) {}

    onSlideScroll(event: Event): void {
        const element = event.target as HTMLElement;
        this.isScrolled.set(element.scrollTop > 50);
    }

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
