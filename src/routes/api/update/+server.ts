import type { RequestEvent, RequestHandler } from "./$types";

import type { DatabasePlayer, DatabaseStats } from "$ts/database/schemas";

import { Receiver } from "@upstash/qstash";
import { getPlayersById } from "$ts/api/slippi";
import { respond } from "$ts/api/respond";

import { API_SECRET, QSTASH_CURRENT_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY } from "$env/static/private";

import dbPromise from "$ts/database/database";

const batch_size = 25;

const qstash = new Receiver({
    currentSigningKey: QSTASH_CURRENT_SIGNING_KEY,
    nextSigningKey: QSTASH_NEXT_SIGNING_KEY,
});

export const POST: RequestHandler = async (event: RequestEvent) => {
    let ok = event.request.headers.get("authorization") === `Bearer ${API_SECRET}`;
    
    ok = ok || await qstash.verify({
        signature: event.request.headers.get("upstash-signature") ?? "",
        body: await event.request.text()
    });

    if (!ok) {
        return respond(401, {
            "status": "error",
            "message": "nice try"
        });
    }

    const db = await dbPromise;

    const playersCollection = db.collection<DatabasePlayer>("players");

    const players = await playersCollection.find().toArray();
    const ids = players.map(x => x.id);

    console.log(`Updating ${ids.length} players...`);

    while (ids.length) {
        const currentIds = [];
        
        for (let i = 0; i < batch_size && ids.length; i++) {
            currentIds.push(ids.shift()!);
        }

        const players = await getPlayersById(currentIds);

        for (let i = 0; i < currentIds.length; i++) {
            playersCollection.findOneAndUpdate({ id: currentIds[i] }, { $set: { data: players[i] } });
        }
    }

    const statsCollection = db.collection<DatabaseStats>("stats");

    if (!(await statsCollection.countDocuments())) {
        statsCollection.insertOne({ lastUpdate: new Date(0) });
    }

    await statsCollection.findOneAndUpdate({}, { $set: { lastUpdate: new Date() } });

    console.log(`Done updating.`);

    return respond(200, {
        "status": "success"
    });
};