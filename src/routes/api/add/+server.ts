import type { RequestEvent, RequestHandler } from "./$types";

import type { DatabasePlayer, DatabasePlayerData } from "$ts/database/schemas";

import { slippiLimiter } from "$ts/state/limiter";

import { getIdByCode, getPlayerById, slippiCharacterToCharacter } from "$ts/api/slippi";
import { respond } from "$ts/api/respond";

import dbPromise from "$ts/database/database";

export const POST: RequestHandler = async (event: RequestEvent) => {
    const json = await event.request.json();

    if (!json.code) {
        return respond(400, {
            "status": "error",
            "message": "no code provided!"
        });
    }

    if (!json.name) {
        return respond(400, {
            "status": "error",
            "message": "no name provided!"
        });
    }
    
    const db = await dbPromise;

    const collection = db.collection<DatabasePlayer>("players");

    await slippiLimiter.removeTokens(1);

    const response = await getIdByCode(json.code);
    const data = (await response.json()).data;

    const id = data.getConnectCode.user.fbUid;

    if (await collection.findOne({ id })) {
        return respond(409, {
            "status": "error",
            "message": "player already exists!"
        });
    }

    const playerResponse = await getPlayerById(id);
    const slippiUser = (await playerResponse.json()).data.getUser;

    const totalGameCount = slippiUser.rankedNetplayProfile.ratingUpdateCount;

    const playerData: DatabasePlayerData = {
        slippi_code: slippiUser.connectCode.code,
        slippi_name: slippiUser.displayName,

        characters: slippiUser.rankedNetplayProfile.characters?.map((x: any) => ({
            character: slippiCharacterToCharacter(x.character),
            proportion: x.gameCount / totalGameCount
        })),

        rating: slippiUser.rankedNetplayProfile.ratingOrdinal,

        wins: slippiUser.rankedNetplayProfile.wins,
        losses: slippiUser.rankedNetplayProfile.losses
    }

    const player: DatabasePlayer = {
        id,
        name: json.name,

        data: playerData,

        addedIp: event.getClientAddress(),
        addedDate: new Date()
    }

    collection.insertOne(player);

    return respond(201, {
        "status": "success"
    });
}