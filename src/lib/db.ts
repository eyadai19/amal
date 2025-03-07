import * as schema from "@/lib/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "server-only";

const connectionString = process.env.DB_URL!;

const client = postgres(connectionString, {
	prepare: false,
});

const db = drizzle(client, {
	schema: schema,
});

export { db };

//Eyad@sql@ahmad@zyc-2024-1     sadjashd321fnaj2
