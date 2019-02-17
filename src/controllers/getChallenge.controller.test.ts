import { handlePost } from "./getChallenge.controller";
import { UserStore } from "../store/users.store";
import { Context } from "koa";

describe("getChallenge controller", () => {
  it("should work", async () => {
    const store: UserStore = {};
    const ctx: Context = { body: { username: "henry" } } as any;
    await handlePost(ctx, store);
    console.log(store);
  });
});
