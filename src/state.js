import fs from "fs";
import path from "path";

const PATH = path.resolve(".booking-cache");
export async function saveState(state) {
  return fs.promises.writeFile(
    PATH,
    JSON.stringify({ createdAt: Date.now(), state }),
    "utf8"
  );
}

export async function getState() {
  const fileExists = fs.existsSync(PATH);
  if (!fileExists) {
    return { successfulBookings: [] };
  }

  const { state } = JSON.parse(await fs.promises.readFile(PATH, "utf8"));
  return state;
}
