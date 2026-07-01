import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './core/i18n/transloco-loader';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),

        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: 'top',
                anchorScrolling: 'enabled',
            }),
        ),
        provideTransloco({
            config: {
                availableLangs: ['fr', 'en'],
                defaultLang: 'fr',
                reRenderOnLangChange: true,
                prodMode: false,
            },
            loader: TranslocoHttpLoader,
        }),
        provideHttpClient(withInterceptors([authInterceptor])),
        {
            provide: LOCALE_ID,
            useValue: 'fr-FR',
        },
    ],
};
