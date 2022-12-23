import type { RequestEvent, RequestHandler } from "./$types";

import type { DatabaseBan, DatabasePlayer } from "$ts/database/schemas";

import { getIdByCode, getPlayersById } from "$ts/api/slippi";
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

    const id = await getIdByCode(json.code);

    if (!id) {
        return respond(404, {
            "status": "error",
            "message": "Player not found!"
        });
    }

    if (await collection.findOne({ id })) {
        return respond(409, {
            "status": "error",
            "message": "Player already exists!"
        });
    }

    const playerData = await getPlayersById([id]);

    const player: DatabasePlayer = {
        id,
        name: json.name,

        data: playerData[0],

        addedIp: event.getClientAddress(),
        addedDate: new Date()
    }

    collection.insertOne(player);

    return respond(201, {
        "status": "success",
        "data": {
            "slug": playerData[0].slippi_code.toLowerCase().replace("#", "-")
        }
    });
}
