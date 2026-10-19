import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL belum diset.");

const connection = await mysql.createConnection(url);

export const db = drizzle({ client: connection, schema, mode: "default" });
