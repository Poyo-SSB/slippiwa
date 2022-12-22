import type { RequestEvent, RequestHandler } from "./$types";

import type { DatabasePlayer, DatabaseStats } from "$ts/database/schemas";

import { Receiver } from "@upstash/qstash";
import { getPlayerById, slippiUserToDatabasePlayerData } from "$ts/api/slippi";
import { respond } from "$ts/api/respond";

import { API_SECRET, QSTASH_CURRENT_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY } from "$env/static/private";

import dbPromise from "$ts/database/database";

const batch_size = 5;

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

    let json: any;

    try {
        json = await event.request.json();
    } catch { }

    const playersCollection = db.collection<DatabasePlayer>("players");

    let ids: string[];

    if (json?.ids) {
        ids = json.ids;
    } else {
        const players = await playersCollection.find().toArray();
        ids = players.map(x => x.id);
    }

    console.log(`Updating players, ${ids.length} left...`);

    const currentIds: string[] = [];

    for (let i = 0; i < batch_size && ids.length; i++) {
        currentIds.push(ids.shift()!);
    }

    for (const id of currentIds) {
        const response = await getPlayerById(id);
        const slippiUser = (await response.json()).data.getUser;

        playersCollection.findOneAndUpdate({ id }, { $set: { data: slippiUserToDatabasePlayerData(slippiUser) } });
    }

    const statsCollection = db.collection<DatabaseStats>("stats");

    if (!(await statsCollection.countDocuments())) {
        statsCollection.insertOne({ lastUpdate: new Date(0) });
    }

    await statsCollection.findOneAndUpdate({}, { $set: { lastUpdate: new Date() } });

    if (ids.length) {
        event.fetch("/api/update", {
            "headers": {
                "Authorization": `Bearer ${API_SECRET}`,
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({ ids }),
            "method": "POST"
        });
    } else {
        console.log("Done updating!");
    }

    return respond(200, {
        "status": "success"
    });
};