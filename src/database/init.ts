import * as SQLite from "expo-sqlite";

const db = await SQLite.openDatabaseAsync("ghsapp-db");

export async function initDatabase() {
  await db.execAsync(`
        CREATE TABLE IF NOT EXISTS quotation_products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_code INTEGER,
            barcode TEXT,
            price REAL,

            )`);
}
