import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AnalyzisInput } from './analyzis-input/analyzis-input';
import { AnalysisProcessing } from './analysis-processing/analysis-processing';
import { AnalysisResult } from './analysis-result/analysis-result';
import { AnalysisList } from './analysis-list/analysis-list';
import { Login } from './login/login';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'analyze', component: AnalyzisInput },
    { path: 'analyze-list', component: AnalysisList },
    { path: 'analyze-processing', component: AnalysisProcessing },
    { path: 'analyze-result/:id', component: AnalysisResult },
    // { path: 'analyze/result/:id', component: AnalysisResultComponent },
    // { path: 'dashboard', component: DashboardComponent },
];
