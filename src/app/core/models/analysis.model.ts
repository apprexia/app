import { CommuneAnalysis, CommuneContext } from './commune-analysis.model';

export interface Analysis {
    id: string;
    userId: string;

    sourceSite: string;
    url: string;

    title: string | null;
    city: string | null;
    codePostal: number | null;

    // Analyse territoriale
    communeAnalysis: CommuneAnalysis | null;
    communeContext: CommuneContext | null;

    rooms: number | null;
    surface: number | null;

    score: number | null;
    scoreExplanation: string | null;

    verdict: Verdict;
    verdictExplanation: string | null;

    // Référence DVF
    dvfReferenceValue: number | null;

    // Estimation Apprexia
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

    // Localisation
    location: LocationAnalysis | null;

    // Amenities
    amenities: AmenityResult | null;

    // Description
    description: string | null;
    imageUrl: string | null;

    strengths: string[];
    risks: string[];

    createdAt: string;
}

// =======================================================
// LOCALISATION
// =======================================================

export interface LocationAnalysis {
    score: number;

    property: PropertyLocation;

    transport: TransportLocation;

    shopping: ShoppingLocation;

    education: EducationLocation;

    badges: string[];

    strengths: string[];

    weaknesses: string[];
}

export interface PropertyLocation {
    lat: number;
    lon: number;
}

export interface NearbyPlace {
    name: string;

    distance: number;

    walkingTime: number;

    lat: number;

    lon: number;
}

export interface TransportLocation {
    metro: NearbyPlace | null;

    tram: NearbyPlace | null;

    bus: NearbyPlace | null;

    trainStation: NearbyPlace | null;
}

export interface ShoppingLocation {
    supermarket: NearbyPlace | null;

    bakery: NearbyPlace | null;

    shoppingCenter: NearbyPlace | null;
}

export interface EducationLocation {
    kindergarten: NearbyPlace | null;

    school: NearbyPlace | null;

    highSchool: NearbyPlace | null;

    university: NearbyPlace | null;

    businessSchool: NearbyPlace | null;
}

// =======================================================

export type YieldLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN' | null;

export type Verdict = 'INVESTIR' | 'FAVORABLE' | 'NEGOCIER' | 'EVITER' | 'ACHETER' | null;

export type MarketPosition =
    | 'SOUS_EVALUE'
    | 'PRIX_MARCHE'
    | 'LEGEREMENT_SURCOTE'
    | 'SURCOTE'
    | null;

// =======================================================
// AMENITIES
// =======================================================

export interface AmenityResult {
    score: number;

    level: 'Premium' | 'Très bon' | 'Bon' | 'Correct' | 'Faible' | 'Non renseigné';

    highlights: AmenityHighlight[];
}

export interface AmenityHighlight {
    label: string;
    icon: string;
    points: number;
}
