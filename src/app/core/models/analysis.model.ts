export interface Analysis {
    id: string;
    userId: string;

    url: string;

    title: string | null;
    city: string | null;

    rooms: number | null;
    surface: number | null;

    score: number | null;
    scoreExplanation: string | null;

    verdict: string | null;

    estimatedValue: number | null;
    askingPrice: number | null;

    recommendedPrice: number | null;
    negotiationAmount: number | null;
    negotiationAnalysis: string | null;

    description: string | null;

    imageUrl: string | null;

    marketPosition: string | null;

    negotiationPotential: number | null;
    riskLevel: number | null;
    verdictExplanation: string | null;
    grossYield: number | null;
    yieldLevel: string | null;

    yieldAnalysis: string | null;
    strengths: string[];
    risks: string[];

    createdAt: string;
}
