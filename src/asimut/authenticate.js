import fetch from "../fetch.js";

const BASE_URL = process.env.ASIMUT_BASE_URL;
// sets session cookies needed for authentication
export default async function authenticate({ username, password }) {
  const loginParams = {
    "authenticate-url": "/public/",
    "authenticate-useraccount": username,
    "authenticate-password": password,
    "authenticate-verification": "ok",
  };

  const loginUrl = `${BASE_URL}/public/login.php`;
  const result = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(loginParams),
  });

  if (result.url === loginUrl) {
    throw new Error("Authentication failed");
  }

  return result;
}
