import { Component, inject, signal } from '@angular/core';
import {
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router,
    RouterOutlet
} from '@angular/router';
import { LanguageService } from './core/services/language/language';
import { PageLoader } from './shared/components/page-loader/page-loader';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, PageLoader],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    private readonly router = inject(Router);
    private readonly languageService = inject(LanguageService);
    protected readonly title = signal('apprexia');
    readonly isLoading = signal(false);

    constructor() {
        this.languageService.init();
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.isLoading.set(true);
            }

            if (
                event instanceof NavigationEnd ||
                event instanceof NavigationCancel ||
                event instanceof NavigationError
            ) {
                this.isLoading.set(false);
            }
        });
    }
}
