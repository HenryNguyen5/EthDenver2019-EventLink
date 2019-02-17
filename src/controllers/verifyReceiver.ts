import { Context } from "koa";
import { userStore, UserState } from "../store/users.store";
import { getPgpKeysFromKeybase } from "../services/keybase.service";
import { verifyKeybaseMessage } from "../services/openpgp.service";

export async function handleGetRequest(ctx: Context, store = userStore) {
  const { username } = ctx.request.query;
  const user = store[username];
  const result = { isVerified: !!(user && user.isVerified) };
  console.log(`[verifyReceiverGet]: Result ${JSON.stringify(result, null, 1)}`);
  return (ctx.body = result);
}

export async function handlePostRequest(ctx: Context, store = userStore) {
  const { username, message } = ctx.request.body;
  const user = store[username];
  if (!user) {
    return (ctx.status = 400);
  }

  let isVerified: boolean;
  try {
    const key = await getPgpKeysFromKeybase(username);
    isVerified = await verifyKeybaseMessage(message, user.expectedMessage, key);
  } catch {
    isVerified = false;
  }

  store[username] = {
    state: UserState.CHALLENGE_VERIFIED,
    expectedMessage: user.expectedMessage,
    isVerified
  };
  ctx.status = 200;

  console.log(
    `[verifyReceiverPost] Set store: ${JSON.stringify(
      store[username],
      null,
      1
    )}`
  );
}
