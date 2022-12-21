import type { RequestEvent, RequestHandler } from "./$types";

import type { DatabasePlayer, DatabasePlayerData, DatabaseStats } from "$ts/database/schemas";

import { slippiLimiter } from "$ts/state/limiter";

import { getPlayerById, slippiCharacterToCharacter } from "$ts/api/slippi";
import { respond } from "$ts/api/respond";

import { API_SECRET } from "$env/static/private";

import dbPromise from "$ts/database/database";

// TODO: this is not scalable, at about 40 players this will start to time out
// solution is to add a batching mechanism which github actions can hook into
export const POST: RequestHandler = async (event: RequestEvent) => {
    if (event.request.headers.get("authorization") !== `Bearer ${API_SECRET}`) {
        return respond(401, {
            "status": "error",
            "message": "nice try"
        });
    }

    const db = await dbPromise;

    const playersCollection = db.collection<DatabasePlayer>("players");
    const players = await playersCollection.find().toArray();

    const ids = players.map(x => x.id);

    for (const id of ids) {
        await slippiLimiter.removeTokens(1);

        const response = await getPlayerById(id);
        const slippiUser = (await response.json()).data.getUser;

        const totalGameCount = slippiUser.rankedNetplayProfile.characters
            ?.map((x: any) => x.gameCount)
            .reduce((a: number, b: number) => a + b, 0);

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

        playersCollection.findOneAndUpdate({ id }, { $set: { data: playerData } });
    }

    const statsCollection = db.collection<DatabaseStats>("stats");
    await statsCollection.findOneAndUpdate({}, { $set: { lastUpdate: new Date() } });

    return respond(200, {
        "status": "success"
    });
};