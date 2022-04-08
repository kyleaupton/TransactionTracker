import { resolve } from "path";
import { Low, JSONFile } from "lowdb";

// Use JSON file for storage
const file = resolve("./db.json");

const adapter = new JSONFile(file);
const db = new Low(adapter);

await db.read();

db.data = db.data || { wallets: [] };

await db.write();

export { db };
