import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

import type { DatabaseBan } from "$ts/database/schemas";

import dbPromise from "$ts/database/database";

export const load: PageServerLoad = async (event) => {
    const db = await dbPromise;

    const bansCollection = db.collection<DatabaseBan>("bans");

    if (await bansCollection.findOne({ ip: event.getClientAddress() })) {
        throw error(403, "no");
    }
};