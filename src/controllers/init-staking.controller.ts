import { Context } from "koa";
import { filteredTweetStore, getTopNLocations } from "../store/tweets.store";
import { provisionHyperStakeContract } from "../services/contract.service";
import { getWallet } from "../services/wallet.service";
import {
  stakingContractStore,
  getStoreJSON
} from "../store/staking-contracts.store";
let hasInited = false;
export async function handlePost(ctx: Context, store = filteredTweetStore) {
  const { username } = ctx.request.body;
  if (!username) {
    throw Error("user name must be supplied");
  }
  if (hasInited) {
    ctx.body = { contracts: getStoreJSON() };
    ctx.status = 200;
    return;
  }
  const wallet = getWallet();
  const topLocations = getTopNLocations(1, store);
  const stakedLocationsPromises = topLocations.map(async loc => {
    console.log(
      `Setting up staking contract for city: ${
        loc[0].origin
      } for keybase user: ${username}....`
    );
    return {
      origin: loc[0].origin,
      contract: await provisionHyperStakeContract(wallet, username)
    };
  });
  const stakedLocations = await Promise.all(stakedLocationsPromises);

  for (const location of stakedLocations) {
    stakingContractStore[location.origin] = location;
  }

  ctx.body = { contracts: getStoreJSON() };
  ctx.status = 200;
  hasInited = true;
  console.log("Done initing staking");
}
