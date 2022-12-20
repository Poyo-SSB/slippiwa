import type { Character } from "$ts/types/character";

export interface DatabasePlayer {
    id: string;
    name: string;

    data: DatabasePlayerData;

    addedIp: string;
    addedDate: Date;
}

export interface DatabasePlayerData {
    slippi_code: string;
    slippi_name: string;

    characters: DatabasePlayerDataCharacters[];

    rating: number;

    wins: number | null;
    losses: number | null;
}

export interface DatabasePlayerDataCharacters {
    character: Character;
    proportion: number;
};

export interface DatabaseStats {
    lastUpdate: Date;
}