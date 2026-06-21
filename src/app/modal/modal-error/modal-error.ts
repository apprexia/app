import { Component, input, Input, output } from '@angular/core';

@Component({
    selector: 'app-modal-error',
    imports: [],
    templateUrl: './modal-error.html',
    styleUrl: './modal-error.scss',
})
export class ModalError {
    isOpen = input(false);
    closed = output<void>();
}
