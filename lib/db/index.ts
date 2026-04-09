import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// For use in server components and API routes
export const createDbClient = (connectionString: string) => {
  const client = postgres(connectionString);
  return drizzle(client, { schema });
};

// For use with Supabase client (reuses connection)
export const createDbFromSupabase = (supabaseClient: any) => {
  // This is a simplified version - in production you'd extract the connection string
  // or use a different approach. For now, we'll use the direct connection string.
  const connectionString = process.env.SUPABASE_DB_URL!;
  return createDbClient(connectionString);
};
