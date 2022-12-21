import type { Character } from "./character";
import type { Tier } from "./tier";

type PlayedCharacter = {
    character: Character;
    proportion: number;
};

export interface Player {
    name: string;

    slippiName: string;
    slippiTag: string;
    slippiDiscriminator: string;

    characters: PlayedCharacter[];

    rating: number | null;
    tier: Tier;

    sets: number;

    wins: number | null;
    losses: number | null;
}