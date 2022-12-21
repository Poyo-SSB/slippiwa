import type { RequestEvent, RequestHandler } from "./$types";

import type { DatabaseBan, DatabasePlayer, DatabasePlayerData } from "$ts/database/schemas";

import { getIdByCode, getPlayerById, slippiCharacterToCharacter } from "$ts/api/slippi";
import { respond } from "$ts/api/respond";

import dbPromise from "$ts/database/database";

export const POST: RequestHandler = async (event: RequestEvent) => {
    const db = await dbPromise;

    const bansCollection = db.collection<DatabaseBan>("bans");

    if (await bansCollection.findOne({ ip: event.getClientAddress() })) {
        return respond(403, {
            "status": "error",
            "message": "no"
        });
    }

    const json = await event.request.json();

    if (!json.code) {
        return respond(400, {
            "status": "error",
            "message": "No code provided!"
        });
    }

    if (!json.name) {
        return respond(400, {
            "status": "error",
            "message": "No name provided!"
        });
    }

    console.log(`Trying to add ${json.name} (${json.code})...`);

    const collection = db.collection<DatabasePlayer>("players");

    const response = await getIdByCode(json.code);
    const data = (await response.json()).data;

    if (!data.getConnectCode) {
        return respond(404, {
            "status": "error",
            "message": "Player not found!"
        });
    }

    const id = data.getConnectCode.user.fbUid;

    if (await collection.findOne({ id })) {
        return respond(409, {
            "status": "error",
            "message": "Player already exists!"
        });
    }

    const playerResponse = await getPlayerById(id);
    const slippiUser = (await playerResponse.json()).data.getUser;

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

    const playerData: DatabasePlayerData = {
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
        "status": "success",
        "data": {
            "slug": slippiUser.connectCode.code.toLowerCase().replace("#", "-")
        }
    });
}