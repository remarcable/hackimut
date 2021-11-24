import fetch from "./fetch.js";

// sets session cookies needed for authentication
export default async function authenticate({ username, password }) {
  const loginParams = {
    "authenticate-url": "/public/",
    "authenticate-useraccount": username,
    "authenticate-password": password,
    "authenticate-verification": "ok",
  };

  const loginUrl = "https://udk-berlin.asimut.net/public/login.php";
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
