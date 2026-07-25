export interface Analysis {
    id: string;
    userId: string;

    sourceSite: string;
    url: string;

    title: string | null;
    city: string | null;
    codePostal: number | null;
    rooms: number | null;
    surface: number | null;

    score: number | null;
    scoreExplanation: string | null;

    verdict: Verdict;
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
    marketPosition: MarketPosition;
    marketAdjustment: string | null;

    // Risque
    riskLevel: number | null;

    // Rentabilité locative
    estimatedRentMonthly: number | null;
    estimatedRentLow: number | null;
    estimatedRentHigh: number | null;

    rentPerSquareMeter: number | null;
    rentConfidence: number | null;

    grossYield: number | null;
    yieldLevel: YieldLevel;
    yieldAnalysis: string | null;

    // Description
    description: string | null;
    imageUrl: string | null;

    strengths: string[];
    risks: string[];

    createdAt: string;
}

type YieldLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN' | null;

type Verdict = 'INVESTIR' | 'NEGOCIER' | 'EVITER' | 'ACHETER' | null;

type MarketPosition = 'SOUS_EVALUE' | 'PRIX_MARCHE' | 'LEGEREMENT_SURCOTE' | 'SURCOTE' | null;
