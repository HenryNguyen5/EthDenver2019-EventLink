import Koa from "koa";
import cors from "@koa/cors";
import Router from "koa-router";
import koaBody from "koa-body";
import { runTweetService } from "./services/tweets.service";
import { drawRoutes } from "./routes";

const app = new Koa();
const router = new Router();
drawRoutes(router);

runTweetService(true);
app.use(koaBody());
app.use(cors({ allowHeaders: "*", origin: "*", allowMethods: "*" }));
app.use(router.routes());
app.listen(3000);
