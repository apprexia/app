import { RenderMode, ServerRoute } from '@angular/ssr';

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
        path: 'analyze-list',
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
        path: 'analyze-result/:id',
        renderMode: RenderMode.Client,
    },

    {
        path: '**',
        renderMode: RenderMode.Server,
    },
];
