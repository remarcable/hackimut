import nodeFetch from "node-fetch-with-proxy";
import fetchCookie from "fetch-cookie/node-fetch.js";

export default fetchCookie(nodeFetch);
