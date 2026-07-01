import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './core/services/language/language';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    private readonly languageService = inject(LanguageService);
    protected readonly title = signal('apprexia');

    constructor() {
        this.languageService.init();
    }
}
