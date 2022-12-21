import type { RequestEvent, RequestHandler } from "./$types";

import type { DatabasePlayer, DatabasePlayerData, DatabaseStats } from "$ts/database/schemas";

import { Receiver } from "@upstash/qstash";

import { slippiLimiter } from "$ts/state/limiter";

import { getPlayerById, slippiCharacterToCharacter } from "$ts/api/slippi";
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
        await slippiLimiter.removeTokens(1);

        const response = await getPlayerById(id);
        const slippiUser = (await response.json()).data.getUser;

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

        playersCollection.findOneAndUpdate({ id }, { $set: { data: playerData } });
    }

    const statsCollection = db.collection<DatabaseStats>("stats");
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