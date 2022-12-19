import type { PageServerLoad } from "./$types";

import type { DatabasePlayer } from "$ts/database/schemas";
import type { Player } from "$ts/types/player";

import dbPromise from "$ts/database/database";
import { getTierFromRating } from "$ts/types/tier";

export const load: PageServerLoad = async () => {
    const db = await dbPromise;

    const collection = db.collection<DatabasePlayer>("players");
    const dbPlayers = await collection.find().toArray();

    const players: Player[] = dbPlayers.map(x => {
        const split = x.slippi_code.split("#");

        const characters = x.data.characters;
        characters.sort((a, b) => b.proportion - a.proportion);

        return {
            name: x.name,

            slippiName: x.data.slippi_name,
            slippiTag: split[0],
            slippiDiscriminator: split[1],

            characters,

            rating: x.data.rating,
            tier: getTierFromRating(x.data?.rating || -1),

            wins: x.data.wins,
            losses: x.data.losses
        }
    });

    players.sort((a, b) => b.rating - a.rating);

    return {
        players
    };
};