import ethers = require("ethers");
import { getPrivateKey } from "./private-key.service";

let wallet: ethers.Wallet;
// Load the wallet to deploy the contract with
// Connect to the network
const provider = ethers.getDefaultProvider("rinkeby");
export function getWallet() {
  if (wallet) {
    return wallet;
  }

  wallet = new ethers.Wallet(getPrivateKey(), provider);
  return wallet;
}
