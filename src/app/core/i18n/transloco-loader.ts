import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslocoLoader } from '@jsverse/transloco';

export class TranslocoHttpLoader implements TranslocoLoader {
    private http = inject(HttpClient);

    getTranslation(lang: string) {
        return this.http.get<Record<string, unknown>>(`/i18n/${lang}.json`);
    }
}
