import dotenv from "dotenv";

dotenv.config();

export const { PORT, DATABASE_URL, JWT_SECRET } = process.env;
