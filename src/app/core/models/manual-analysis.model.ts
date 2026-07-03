export interface ManualAnalysis {
    adresse: string;

    ville: string;

    codePostal: string;

    latitude: number;

    longitude: number;

    type: string;

    surface: number;

    pieces: number;

    prix: number;

    etage: number | null;

    etat: string;

    dpe: string;

    sourceSite: string;

    balcon: boolean;

    parking: boolean;
}
