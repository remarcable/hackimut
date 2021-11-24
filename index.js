import { config as dotenvConfig } from "dotenv";
import authenticate from "./authenticate.js";

dotenvConfig();

await authenticate({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
});
