import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config({
    path: path.resolve(process.cwd(), "backend/.env"),
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(
    __dirname,
    "../../../..",
    "backups",
    "opportunities-recovery",
);

const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");

async function exportCollection(db, collectionName) {
    const collection = db.collection(collectionName);

    const exists = await db
        .listCollections({ name: collectionName })
        .hasNext();

    if (!exists) {
        console.log(`Collection not found: ${collectionName}`);
        return null;
    }

    const records = await collection.find({}).toArray();

    const filename = `${collectionName}-${timestamp}.json`;

    await fs.writeFile(
        path.join(OUTPUT_DIR, filename),
        JSON.stringify(records, null, 2),
        "utf8",
    );

    console.log(
        `Exported ${records.length} records: ${filename}`,
    );

    return {
        collection: collectionName,
        count: records.length,
        file: filename,
    };
}

async function main() {
    if (!process.env.MONGO_URI) {
        throw new Error(
            "MONGO_URI is missing from backend/.env",
        );
    }

    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    const db = mongoose.connection.db;

    if (!db) {
        throw new Error("MongoDB connection was not established.");
    }

    console.log("Connected. Starting read-only exports.");

    const collections = await db
        .listCollections({}, { nameOnly: true })
        .toArray();

    const names = collections.map((item) => item.name);

    console.log("\nCollections available:");
    names.forEach((name) => console.log(`- ${name}`));

    const opportunityCollection = names.find(
        (name) => name === "opportunities",
    );

    if (!opportunityCollection) {
        throw new Error(
            "Collection 'opportunities' was not found. No records were modified.",
        );
    }

    const results = [];

    /*
     * Export opportunities first.
     */
    results.push(
        await exportCollection(db, opportunityCollection),
    );

    /*
     * Export application records and likely related collections.
     * Only collections that actually exist are exported.
     */
    const relatedCollectionNames = [
        "applications",
        "bookings",
        "invoices",
        "payments",
        "receipts",
        "notifications",
        "auditlogs",
        "documents",
        "users",
        "customers",
    ];

    for (const name of relatedCollectionNames) {
        if (names.includes(name)) {
            results.push(await exportCollection(db, name));
        }
    }

    const report = {
        createdAt: new Date().toISOString(),
        database: db.databaseName,
        mode: "READ_ONLY_EXPORT",
        collections: results.filter(Boolean),
    };

    await fs.writeFile(
        path.join(
            OUTPUT_DIR,
            `export-manifest-${timestamp}.json`,
        ),
        JSON.stringify(report, null, 2),
        "utf8",
    );

    console.log("\nExport completed.");
    console.log(`Backup directory: ${OUTPUT_DIR}`);
    console.log("No database records were modified.");
}

main()
    .catch((error) => {
        console.error("\nExport failed:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect().catch(() => {});
    });