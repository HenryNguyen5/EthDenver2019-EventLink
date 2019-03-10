import { Context } from "koa";
import { randomBytes } from "crypto";
import { userStore, UserState } from "../store/users.store";

export async function handlePost(ctx: Context, store = userStore) {
  const { username } = ctx.request.body;

  const challengeMessage = `CHALLENGE FOR ${username}: ${randomBytes(
    32
  ).toString("hex")}`;

  store[username] = {
    state: UserState.CHALLENGE_SENT,
    isVerified: false,
    expectedMessage: challengeMessage
  };

  console.log(
    `[getChallenge] Set userstore: ${JSON.stringify(store[username], null, 1)}`
  );

  ctx.status = 200;
  ctx.body = { challengeMessage };
}
