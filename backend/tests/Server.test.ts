import { assertExists } from '../deps.ts';
import { decode } from "../deps.ts";
import { dotenv } from "../src/utils/dotenv.parser.ts";

// loading .env vars
const env = dotenv();

const url = `http://${env.HOST_NAME}:${env.SERVER_PORT}`;

// server must run on port below
Deno.test(`Server reachable on address ${url}`, async () => {
    const res = await fetch(url);
    const body = decode(new Uint8Array(await res.arrayBuffer()));
    assertExists(body);
});