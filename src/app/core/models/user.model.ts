export interface UserProfile {
    id: string;

    name: string | null;
    email: string;

    avatar: string | null;

    credits: number;

    stats: UserStats;
}

export interface UserStats {
    analyses: number;

    favorites: number;

    opportunityRate: number;

    investir: number;

    negocier: number;

    eviter: number;
}
