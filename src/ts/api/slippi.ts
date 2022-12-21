import { slippiLimiter } from "$ts/state/limiter";

import type { Character } from "$ts/types/character";
import type { DatabasePlayerData } from "$ts/database/schemas";

import get_id_by_code from "$gql/GetIdByCode.gql?raw";
import get_player_by_id from "$gql/GetPlayerById.gql?raw";

export async function getIdByCode(code: string): Promise<Response> {
    await slippiLimiter.removeTokens(1);

    return await fetch("https://gql-gateway-dot-slippi.uc.r.appspot.com/graphql", {
        "headers": {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            operationName: "GetIdByCode",
            query: get_id_by_code,
            variables: {
                code
            }
        }),
        "method": "POST"
    });
}

export async function getPlayerById(id: string): Promise<Response> {
    await slippiLimiter.removeTokens(1);

    return await fetch("https://gql-gateway-dot-slippi.uc.r.appspot.com/graphql", {
        "headers": {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            operationName: "GetPlayerById",
            query: get_player_by_id,
            variables: {
                id
            }
        }),
        "method": "POST"
    });
}

const slippiSlugMap: Record<string, Character> = {
    "BOWSER": "Bowser",
    "CAPTAIN_FALCON": "Captain Falcon",
    "DONKEY_KONG": "Donkey Kong",
    "DR_MARIO": "Dr. Mario",
    "FALCO": "Falco",
    "FOX": "Fox",
    "GAME_AND_WATCH": "Mr. Game & Watch",
    "GANONDORF": "Ganondorf",
    "ICE_CLIMBERS": "Ice Climbers",
    "KIRBY": "Kirby",
    "LINK": "Link",
    "LUIGI": "Luigi",
    "MARIO": "Mario",
    "MARTH": "Marth",
    "MEWTWO": "Mewtwo",
    "NESS": "Ness",
    "PEACH": "Peach",
    "PICHU": "Pichu",
    "PIKACHU": "Pikachu",
    "JIGGLYPUFF": "Jigglypuff",
    "ROY": "Roy",
    "SAMUS": "Samus",
    "SHEIK": "Sheik",
    "YOSHI": "Yoshi",
    "YOUNG_LINK": "Young Link",
    "ZELDA": "Zelda",
};

export function slippiCharacterToCharacter(slippi: string): Character {
    return slippiSlugMap[slippi];
}

export function slippiUserToDatabasePlayerData(slippiUser: any): DatabasePlayerData {
    const totalGameCount = slippiUser.rankedNetplayProfile.characters
        ?.map((x: any) => x.gameCount)
        .reduce((a: number, b: number) => a + b, 0);

    let wins = slippiUser.rankedNetplayProfile.wins;
    let losses = slippiUser.rankedNetplayProfile.losses;

    // in case a player has won but not lost/lost but not won yet
    if (wins || losses) {
        wins = wins ?? 0;
        losses = losses ?? 0;
    }

    return {
        slippi_code: slippiUser.connectCode.code,
        slippi_name: slippiUser.displayName,

        characters: slippiUser.rankedNetplayProfile.characters?.map((x: any) => ({
            character: slippiCharacterToCharacter(x.character),
            proportion: x.gameCount / totalGameCount
        })),

        rating: slippiUser.rankedNetplayProfile.ratingOrdinal,

        sets: slippiUser.rankedNetplayProfile.ratingUpdateCount,

        wins,
        losses
    };
}