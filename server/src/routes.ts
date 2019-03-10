import Router from "koa-router";
import { filteredTweetStore } from "./store/tweets.store";
import * as getChallengeController from "./controllers/getChallenge.controller";
import * as verifyReceiver from "./controllers/verifyReceiver";
import * as initStakingController from "./controllers/init-staking.controller";

/**
 * Define routes
 * @param server HTTP Server
 * @param r Koa router
 */
export function drawRoutes(r: Router): void {
  r.get("/tweets", ctx => {
    ctx.body = {
      result: filteredTweetStore
    };
  });

  r.post("/initStaking", ctx => initStakingController.handlePost(ctx));

  // user calls this to get a message to sign
  // const { username } = ctx.request.body;
  r.post("/getChallenge", ctx => getChallengeController.handlePost(ctx));

  // user calls this before calling withdraw on staking contract
  // const { username, message } = ctx.request.body;
  r.post("/verifyReceiver", ctx => verifyReceiver.handlePostRequest(ctx));

  // chainlink node calls this
  r.get("/verifyReceiver", ctx => verifyReceiver.handleGetRequest(ctx));
}
