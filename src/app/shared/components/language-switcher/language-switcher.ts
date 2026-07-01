import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../core/services/language/language';

@Component({
    selector: 'app-language-switcher',
    templateUrl: './language-switcher.html',
    styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {

    readonly languageService = inject(LanguageService);

    open = false;

    languages = [
        {
            code: 'fr',
            label: 'Français',
            flag: '🇫🇷',
        },
        {
            code: 'en',
            label: 'English',
            flag: '🇬🇧',
        },
    ];

    get currentLanguage() {
        return this.languages.find(
            lang => lang.code === this.languageService.getCurrentLanguage()
        ) ?? this.languages[0];
    }

    toggle() {
        this.open = !this.open;
    }

    changeLanguage(code: string) {
        this.languageService.setLanguage(code);
        this.open = false;
    }
}
