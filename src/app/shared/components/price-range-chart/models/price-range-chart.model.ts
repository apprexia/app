export interface PriceRangeChartData {
    /**
     * Prix affiché dans l'annonce
     */
    askingPrice: number;

    /**
     * Valeur basse estimée Apprexia
     */
    estimatedLow: number;

    /**
     * Valeur haute estimée Apprexia
     */
    estimatedHigh: number;

    /**
     * Valeur moyenne DVF
     */
    dvfPrice?: number | null;

    /**
     * Devise
     */
    currency?: string;

    /**
     * Verdict Apprexia
     */
    verdict?: 'INVESTIR' | 'NEGOCIER' | 'EVITER';
}
