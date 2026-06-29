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
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'analyze', component: AnalyzisInput },
    { path: 'analyze-list', component: AnalysisList, canActivate: [authGuard] },
    { path: 'analyze-processing', component: AnalysisProcessing, canActivate: [authGuard] },
    { path: 'analyze-result/:id', component: AnalysisResult, canActivate: [authGuard] },
    { path: 'auth/success', component: AuthSuccess },
    { path: 'account', component: Account, canActivate: [authGuard] },
    { path: 'favorites', component: Favorite, canActivate: [authGuard] },
];
