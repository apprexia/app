import { RenderMode, ServerRoute } from '@angular/ssr';
import { CreditsSuccess } from './pages/credits-success/credits-success';
import { CreditsCancel } from './pages/credits-cancel/credits-cancel';

export const serverRoutes: ServerRoute[] = [
    {
        path: '',
        renderMode: RenderMode.Server,
    },

    {
        path: 'login',
        renderMode: RenderMode.Server,
    },
    {
        path: 'credits/success',
        renderMode: RenderMode.Client,
    },
    {
        path: 'credits/cancel',
        renderMode: RenderMode.Client,
    },
    {
        path: 'cgv',
        renderMode: RenderMode.Client,
    },
    {
        path: 'cgu',
        renderMode: RenderMode.Client,
    },
    {
        path: 'terms',
        renderMode: RenderMode.Client,
    },
    {
        path: 'rgpd',
        renderMode: RenderMode.Client,
    },
    {
        path: 'analyze-list',
        renderMode: RenderMode.Client,
    },
    {
        path: 'analyze-failed/:id',
        renderMode: RenderMode.Client,
    },
    {
        path: 'account',
        renderMode: RenderMode.Client,
    },

    {
        path: 'favorites',
        renderMode: RenderMode.Client,
    },

    {
        path: 'credits',
        renderMode: RenderMode.Client,
    },

    {
        path: 'analyze-result/:id',
        renderMode: RenderMode.Client,
    },

    {
        path: '**',
        renderMode: RenderMode.Server,
    },
];
