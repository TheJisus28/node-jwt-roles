import pkg from "pg";
import { DATABASE_URL } from "../../../config.js";
const { Pool } = pkg;

export const db = new Pool({
  allowExitOnIdle: true,
  connectionString: DATABASE_URL,
});
