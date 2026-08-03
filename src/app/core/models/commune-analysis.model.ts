export interface CommuneAnalysis {
    level: string;
    score: number;

    breakdown: {
        taxation: number;
        realEstate: number;
        environment: number;
        demographics: number;
        accessibility: number;
    };

    strengths: string[];
    weaknesses: string[];

    communeContext?: CommuneContext;
}

export interface CommuneContext {
    codeInsee: string;

    commune: string;

    region: string;

    codeDepartement: string;

    population: number | null;

    dvfTransactions: number;

    medianPriceM2: number;

    medianApartmentPriceM2: number | null;

    medianHousePriceM2: number | null;

    priceEvolution5Years: number | null;

    evolutionPopulation5Years: number | null;

    fiberCoverage: number | null;

    schoolIndex: number | null;

    doctorAccess: number | null;

    propertyTaxM2: number | null;

    propertyTaxRate: number | null;

    dpeAB: number | null;

    passoiresDpe: number | null;

    floodRisk: number | null;

    icpeSurface: number | null;

    sevesoSurface: number | null;

    localScore: number | null;

    createdAt: string;

    updatedAt: string;
}
