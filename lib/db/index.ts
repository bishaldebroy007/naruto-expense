import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// For use in server components and API routes
export const createDbClient = (connectionString: string) => {
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema });
};

// Get database client from environment variable
export const db = createDbClient(process.env.DATABASE_URL!);
