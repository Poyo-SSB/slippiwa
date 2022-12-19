import type { RequestHandler } from "@sveltejs/kit";

import type { Character } from "$ts/types/character";
import type { DatabasePlayer, DatabasePlayerData, DatabasePlayerDataCharacters } from "$ts/database/schemas";

import { RateLimiter } from "limiter";

import dbPromise from "$ts/database/database";

import GQL_QUERY from "$gql/GetPlayerByCode.gql?raw";

const limiter = new RateLimiter({ tokensPerInterval: 1, interval: "second" });

export const GET: RequestHandler = async () => {
    const db = await dbPromise;

    const collection = db.collection<DatabasePlayer>("players");
    const players = await collection.find().toArray();

    for (const player of players) {
        await limiter.removeTokens(1);

        const response = await fetch("https://gql-gateway-dot-slippi.uc.r.appspot.com/graphql", {
            "headers": {
                "accept": "*/*",
                "cache-control": "no-cache",
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                operationName: "GetPlayerByCode",
                query: GQL_QUERY,
                variables: {
                    code: player.slippi_code
                }
            }),
            "method": "POST"
        });

        const data = (await response.json()).data;

        const totalGameCount = data.getConnectCode.user.rankedNetplayProfile.characters
            .map((x: any) => x.gameCount).reduce((a: number, b: number) => a + b, 0);

        const playerData: DatabasePlayerData = {
            slippi_name: data.getConnectCode.user.displayName,

            characters: data.getConnectCode.user.rankedNetplayProfile.characters.map((x: any) => slippiCharacterToDatabase(x, totalGameCount)),

            rating: data.getConnectCode.user.rankedNetplayProfile.ratingOrdinal,

            wins: data.getConnectCode.user.rankedNetplayProfile.wins,
            losses: data.getConnectCode.user.rankedNetplayProfile.losses
        }

        collection.findOneAndUpdate({ slippi_code: player.slippi_code }, { $set: { data: playerData } });
    }

    return new Response(
        JSON.stringify({
            "status": "success"
        }),
        {
            headers: { "Content-Type": "application/json" },
            status: 200
        }
    );
};

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
    "KIRBY": "Jigglypuff",
    "LINK": "Kirby",
    "LUIGI": "Link",
    "MARIO": "Luigi",
    "MARTH": "Mario",
    "MEWTWO": "Marth",
    "NESS": "Mewtwo",
    "PEACH": "Ness",
    "PICHU": "Peach",
    "PIKACHU": "Pichu",
    "JIGGLYPUFF": "Pikachu",
    "ROY": "Roy",
    "SAMUS": "Samus",
    "SHEIK": "Sheik",
    "YOSHI": "Yoshi",
    "YOUNG_LINK": "Young Link",
    "ZELDA": "Zelda",
};

function slippiCharacterToDatabase(slippiUsage: any, totalGames: number): DatabasePlayerDataCharacters {
    return {
        character: slippiSlugMap[slippiUsage.character],
        proportion: slippiUsage.gameCount / totalGames
    }
}