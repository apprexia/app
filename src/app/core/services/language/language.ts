import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    private readonly transloco = inject(TranslocoService);
    private readonly platformId = inject(PLATFORM_ID);

    private readonly STORAGE_KEY = 'apprexia-language';

    init() {
        if (!isPlatformBrowser(this.platformId)) {
            this.transloco.setActiveLang('fr');
            return;
        }

        const lang = localStorage.getItem(this.STORAGE_KEY) ?? 'fr';

        this.transloco.setActiveLang(lang);
    }

    setLanguage(lang: string) {
        this.transloco.setActiveLang(lang);

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.STORAGE_KEY, lang);
        }
    }

    getCurrentLanguage(): string {
        return this.transloco.getActiveLang();
    }
}
