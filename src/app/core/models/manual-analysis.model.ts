export interface ManualAnalysis {
    adresse: string;

    ville: string;

    codePostal: string;

    latitude: number;

    longitude: number;

    typeLocal: string;

    surface: number;

    terrain: number;

    pieces: number;

    prix: number;

    etage: number | null;

    etat: string;

    dpe: string;

    sourceSite: string;

    propertyFeatures: PropertyFeatures;
}

export interface PropertyFeatures {
    duplex: boolean;
    triplex: boolean;
    loft: boolean;

    terrasse: boolean;
    balcon: boolean;
    loggia: boolean;
    jardin: boolean;
    patio: boolean;

    piscine: boolean;
    jacuzzi: boolean;
    spa: boolean;
    sauna: boolean;

    parking: boolean;
    garage: boolean;
    box: boolean;
    cave: boolean;
    grenier: boolean;

    ascenseur: boolean;
    gardien: boolean;
    digicode: boolean;
    interphone: boolean;
    visiophone: boolean;

    climatisation: boolean;
    cheminee: boolean;
    cuisineEquipee: boolean;
    dressing: boolean;
    buanderie: boolean;

    vueMer: boolean;
    vueMontagne: boolean;
    vuePanoramique: boolean;
    vueDegagee: boolean;

    dernierEtage: boolean;
    traversant: boolean;
    lumineux: boolean;
    calme: boolean;
    renove: boolean;
    standing: boolean;
    prestige: boolean;
}
