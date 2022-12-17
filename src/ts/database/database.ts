import { MONGODB_URI } from "$env/static/private";

import { MongoClient } from "mongodb";

let client = new MongoClient(MONGODB_URI, {});
let dbPromise = client.connect().then(x => x.db("web"));

export default dbPromise;
