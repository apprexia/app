export interface Analysis {
    id: string;
    userId: string;

    sourceSite: string;
    url: string;

    title: string | null;
    city: string |null;

    rooms: number | null;
    surface: number | null;

    score: number | null;
    scoreExplanation: string | null;

    verdict: string | null;
    verdictExplanation: string | null;

    // Référence DVF
    dvfReferenceValue: number | null;

    // Estimation finale Apprexia
    estimatedValue: number | null;
    estimatedValueLow: number | null;
    estimatedValueHigh: number | null;

    // Prix
    askingPrice: number | null;
    recommendedPrice: number | null;

    // Négociation
    negotiationAmount: number | null;
    negotiationPotential: number | null;
    negotiationAnalysis: string | null;

    // Position marché
    marketPosition: string | null;
    marketAdjustment: string | null;

    // Risque
    riskLevel: number | null;

    // Rentabilité
    grossYield: number | null;
    yieldLevel: string | null;
    yieldAnalysis: string | null;

    // Description
    description: string | null;
    imageUrl: string | null;

    strengths: string[];
    risks: string[];

    createdAt: string;
}
