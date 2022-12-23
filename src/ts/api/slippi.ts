import { slippiLimiter } from "$ts/state/limiter";

import type { Character } from "$ts/types/character";
import type { DatabasePlayerData } from "$ts/database/schemas";

import fragment_player from "$gql/FragmentPlayer.gql?raw";
import get_id_by_code from "$gql/GetIdByCode.gql?raw";

export async function getIdByCode(code: string): Promise<string | null> {
    await slippiLimiter.removeTokens(1);

    const response = await fetch("https://gql-gateway-dot-slippi.uc.r.appspot.com/graphql", {
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

    const data = (await response.json()).data;

    if (!data.connectCode) {
        return null;
    }

    return data.getConnectCode.user.fbUid;
}

// horrible batching mechanism
export async function getPlayersById(ids: string[]): Promise<DatabasePlayerData[]> {
    await slippiLimiter.removeTokens(1);

    const queryParams = ids.map((_, i) => `$i${i}: String!`).join(", ");
    const aliases = ids.map((_, i) => `u${i}: getUser(fbUid: $i${i}) { ...Player }`).join("\n");

    const query = fragment_player + `query GetPlayersById(${queryParams}) { ${aliases} }`;

    const variables: any = {};

    for (let i = 0; i < ids.length; i++) {
        variables["i" + i] = ids[i];
    }

    const response = await fetch("https://gql-gateway-dot-slippi.uc.r.appspot.com/graphql", {
        "headers": {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            operationName: "GetPlayersById",
            query,
            variables
        }),
        "method": "POST"
    });

    const data = (await response.json()).data;

    const players: DatabasePlayerData[] = [];

    for (let i = 0; i < ids.length; i++) {
        players.push(slippiUserToDatabasePlayerData(data["u" + i]));
    }

    return players;
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

function slippiCharacterToCharacter(slippi: string): Character {
    return slippiSlugMap[slippi];
}

function slippiUserToDatabasePlayerData(slippiUser: any): DatabasePlayerData {
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