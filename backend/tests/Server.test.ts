import { assertExists } from '../deps.ts';
import { decode } from "../deps.ts";
// import { dotenv } from "../src/utils/dotenv.parser.ts";

// loading .env vars
// todo doesn't seem to work
// const env = dotenv();

// server must run on port below
Deno.test('Server reachable on address `http://0.0.0.0:8071`', async () => {
    // todo
    // const url = `http://${env.hostname}:${env.port}`
    const res = await fetch(`http://0.0.0.0:8071`);
    const body = decode(new Uint8Array(await res.arrayBuffer()));
    assertExists(body);
});