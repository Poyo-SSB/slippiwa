import type { RequestHandler } from "@sveltejs/kit";

import type { DatabasePlayer, DatabasePlayerData } from "$ts/database/schemas";

import { slippiLimiter } from "$ts/state/limiter";

import { getPlayerById, slippiCharacterToCharacter } from "$ts/api/slippi";
import { respond } from "$ts/api/respond";

import dbPromise from "$ts/database/database";

export const POST: RequestHandler = async () => {
    const db = await dbPromise;

    const collection = db.collection<DatabasePlayer>("players");
    const players = await collection.find().toArray();

    const ids = players.map(x => x.id);

    for (const id of ids) {
        await slippiLimiter.removeTokens(1);

        const response = await getPlayerById(id);
        const slippiUser = (await response.json()).data.getUser;

        const totalGameCount = slippiUser.rankedNetplayProfile.characters
            ?.map((x: any) => x.gameCount)
            .reduce((a: number, b: number) => a + b, 0);

        console.log(slippiUser.rankedNetplayProfile);

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

        collection.findOneAndUpdate({ id }, { $set: { data: playerData } });
    }

    return respond(200, {
        "status": "success"
    });
};