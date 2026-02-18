// db.js
import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "elgatoaa",
  host: "localhost",
  database: "anime",
  password: "",
  port: 5432
});
