import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    isOpen = signal(false);
    title = signal('');
    message = signal('');

    open(title: string, message: string) {
        this.title.set(title);
        this.message.set(message);
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
    }
}
