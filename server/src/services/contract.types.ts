import ethers from "ethers";

export interface Overrides {
  gasLimit: number;
  gasPrice: ReturnType<typeof ethers.utils.parseUnits>;
  nonce: number;
  value: ReturnType<typeof ethers.utils.parseEther>;
  chainId: number;
}

export interface HyperStake extends ethers.ethers.Contract {
  getReceiver(overrides?: Partial<Overrides>): Promise<string>;
  getMaxStake(overrides?: Partial<Overrides>): Promise<ethers.utils.BigNumber>;
  getBalance(overrides?: Partial<Overrides>): Promise<ethers.utils.BigNumber>;
  getBalanceOfStaker(
    userAddress: string,
    overrides?: Partial<Overrides>
  ): Promise<ethers.utils.BigNumber>;
  stake(overrides?: Partial<Overrides>): Promise<ethers.ContractTransaction>;
  refund(overrides?: Partial<Overrides>): Promise<void>;
  requestPayout(
    subdomain: string,
    overrides?: Partial<Overrides>
  ): Promise<ethers.ContractTransaction>;
  concat(
    str1: string,
    str2: string,
    str3: string,
    str4: string,
    overrides?: Partial<Overrides>
  ): Promise<string>;
}

export interface Erc20 extends ethers.ethers.Contract {
  transfer(
    to: string,
    value: ethers.utils.BigNumber,
    overrides?: Partial<Overrides>
  ): Promise<ethers.ContractTransaction>;
}
