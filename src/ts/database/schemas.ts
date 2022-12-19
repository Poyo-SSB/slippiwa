import type { Character } from "$ts/types/character";

export interface DatabasePlayer {
    slippi_code: string;
    name: string;

    data: DatabasePlayerData;
}

export interface DatabasePlayerData {
    slippi_name: string;

    characters: DatabasePlayerDataCharacters[];

    rating: number;

    wins: number;
    losses: number;
}

export interface DatabasePlayerDataCharacters {
    character: Character;
    proportion: number;
};