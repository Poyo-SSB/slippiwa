import type { PageServerLoad } from "./$types";

import type { DatabasePlayer, DatabaseStats } from "$ts/database/schemas";
import type { Player } from "$ts/types/player";
import type { Tier } from "$ts/types/tier";

import dbPromise from "$ts/database/database";
import { getTierFromRating } from "$ts/types/tier";

export const load: PageServerLoad = async () => {
    const db = await dbPromise;

    const playersCollection = db.collection<DatabasePlayer>("players");
    const dbPlayers = await playersCollection.find().toArray();

    const players: Player[] = dbPlayers.map(x => {
        const split = x.data.slippi_code.split("#");

        const characters = x.data.characters || [];
        characters.sort((a, b) => b.proportion - a.proportion);

        let tier: Tier = "Unranked";

        if (x.data.wins !== null) {
            if (x.data.sets < 5) {
                tier = "Pending";
            } else {
                tier = getTierFromRating(x.data.rating);
            }
        }

        const rating = x.data.sets >= 5 ? x.data.rating : null;

        return {
            name: x.name,

            slippiName: x.data.slippi_name,
            slippiTag: split[0],
            slippiDiscriminator: split[1],

            characters,

            rating,
            tier,

            sets: x.data.sets,

            wins: x.data.wins,
            losses: x.data.losses
        }
    });

    players.sort((a, b) => {
        const compareRating = (b.rating ?? 0) - (a.rating ?? 0);

        if (compareRating !== 0) {
            return compareRating;
        }

        // rating must be unranked or pending
        if (a.tier !== b.tier) {
            if (a.tier === "Pending") {
                return -1;
            } else {
                return 1;
            }
        }

        // wow...
        const bw: number = b.wins ?? 0;
        const bl: number = b.losses ?? 0;
        const aw: number = a.wins ?? 0;
        const al: number = a.losses ?? 0;

        return ((bw / (bw + bl)) || 0) - ((aw / (aw + al)) || 0);
    });

    const statsCollection = db.collection<DatabaseStats>("stats");

    if (!await statsCollection.countDocuments()) {
        await statsCollection.insertOne({ lastUpdate: new Date(0) });
    }

    const lastUpdate = (await statsCollection.findOne({}))!.lastUpdate;

    return {
        players,
        lastUpdate
    };
};