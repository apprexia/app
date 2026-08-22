import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AnalyzisInput } from './pages/analyzis-input/analyzis-input';
import { AnalysisProcessing } from './pages/analysis-processing/analysis-processing';
import { AnalysisResult } from './pages/analysis-result/analysis-result';
import { AnalysisList } from './pages/analysis-list/analysis-list';
import { Login } from './pages/login/login';
import { AuthSuccess } from './pages/auth-success/auth-success';
import { Account } from './pages/account/account';
import { Favorite } from './pages/favorite/favorite';
import { authGuard } from './core/guards/auth/auth-guard';
import { CreditsStore } from './pages/credits-store/credits-store';
import { CreditsSuccess } from './pages/credits-success/credits-success';
import { CreditsCancel } from './pages/credits-cancel/credits-cancel';
import { Cgv } from './pages/cgv/cgv';
import { Terms } from './pages/terms/terms';
import { Rgpd } from './pages/rgpd/rgpd';
import { Cgu } from './pages/cgu/cgu';
import { AnalysisFailed } from './pages/analysis-failed/analysis-failed';
import { creditGuard } from './core/guards/credit/credit-guard';
import { adminGuard } from './core/guards/admin/admin-guard';
import { AnalysisUnsupported } from './pages/analysis-unsupported/analysis-unsupported';
import { AdminUsers } from './pages/admin/admin-users/admin-users';
import { AdminAnalyses } from './pages/admin/admin-analyses/admin-analyses';
import { AdminCredits } from './pages/admin/admin-credits/admin-credits';
import { AdminLayout } from './pages/admin/admin-layout/admin-layout';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { AdminUserDetail } from './pages/admin/admin-user-detail/admin-user-detail';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'analyze', component: AnalyzisInput },
    { path: 'analyze-list', component: AnalysisList, canActivate: [authGuard] },
    {
        path: 'analyze-processing',
        component: AnalysisProcessing,
        canActivate: [authGuard, creditGuard],
    },
    { path: 'analyze-failed/:id', component: AnalysisFailed, canActivate: [authGuard] },
    { path: 'analyze-unsupported/:id', component: AnalysisUnsupported, canActivate: [authGuard] },
    { path: 'analyze-result/:id', component: AnalysisResult, canActivate: [authGuard] },
    { path: 'auth/success', component: AuthSuccess },
    { path: 'account', component: Account, canActivate: [authGuard] },
    { path: 'favorites', component: Favorite, canActivate: [authGuard] },
    { path: 'credits', component: CreditsStore, canActivate: [authGuard] },
    { path: 'credits/success', component: CreditsSuccess },
    { path: 'credits/cancel', component: CreditsCancel },
    { path: 'cgv', component: Cgv },
    { path: 'cgu', component: Cgu },
    { path: 'terms', component: Terms },
    { path: 'rgpd', component: Rgpd },
    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [adminGuard],
        children: [
            {
                path: '',
                component: AdminDashboard,
            },
            {
                path: 'users',
                component: AdminUsers,
            },
            {
                path: 'users/:id',
                component: AdminUserDetail,
            },
            {
                path: 'analyses',
                component: AdminAnalyses,
            },
            {
                path: 'credits',
                component: AdminCredits,
            },
        ],
    },
];
