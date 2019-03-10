import { HyperStake } from "../services/contract.types";

interface StakingContractsStore {
  [origin: string]: { contract: HyperStake; origin: string };
}

interface StakingContractsStoreJSON {
  [origin: string]: { address: string; origin: string };
}

export const stakingContractStore: StakingContractsStore = {};
export function getStoreJSON() {
  const x: StakingContractsStoreJSON = {};
  Object.keys(stakingContractStore).forEach(k => {
    x[k] = {
      address: stakingContractStore[k].contract.address,
      origin: stakingContractStore[k].origin
    };
  });

  return x;
}
