import ethers = require("ethers");
import { Erc20, HyperStake } from "./contract.types";
import { appConfig } from "../config";
import { BigNumber } from "ethers/utils";
import { stakingContractStore } from "../store/staking-contracts.store";
const LINK_ERC20 = require("../contracts/linkERC20.json");
const HYPERSTAKE_CONTRACT = require("../contracts/HyperStake.json");

const DEFAULT_GAS_PRICE = { gasPrice: ethers.utils.parseUnits("30", "gwei") };

export function connectToErc20Contract(
  signer: ethers.Wallet,
  contractAddress: string
): Promise<Erc20> {
  const contract = new ethers.Contract(contractAddress, LINK_ERC20.abi, signer);
  return contract as any;
}

export async function transferLink(
  signer: ethers.Wallet,
  to: string,
  value: BigNumber
) {
  const contract = await connectToErc20Contract(
    signer,
    appConfig.linkTokenAddress
  );

  console.log("Transfering link to contract...");
  return await contract
    .transfer(to, value, DEFAULT_GAS_PRICE)
    .then(t => t.wait());
}

export async function stakeToHyperstakeContract(
  contract: HyperStake,
  value: BigNumber
) {
  console.log(
    `Staking ${ethers.utils.formatEther(value)}ETH to contract ${
      contract.address
    }....`
  );
  await contract.stake({ ...DEFAULT_GAS_PRICE, value }).then(t => t.wait());
  console.log(
    `Staking ${ethers.utils.formatEther(value)}ETH to contract ${
      contract.address
    } done!`
  );
}

export async function getHyperStakeBalance(origin: string) {
  const stakingContract = stakingContractStore[origin];
  if (!stakingContract) {
    throw Error(`No staking contract found for origin: ${origin}`);
  }

  return await stakingContract.contract.getBalance();
}

export async function provisionHyperStakeContract(
  signer: ethers.Wallet,
  username: string
) {
  console.log(
    `Provisioning hyperstake contract for keybase user: ${username}...`
  );

  const address = await deployHyperStakeContract(signer, username);
  const contract = await connectToHyperStakeContract(signer, address);
  // fund with enough link to make requests
  await transferLink(signer, contract.address, ethers.utils.parseEther("10"));

  console.log("Hyperstake contract provisioned!");
  return contract;
}

export function connectToHyperStakeContract(
  signer: ethers.Wallet,
  contractAddress: string
): Promise<HyperStake> {
  const contract = new ethers.Contract(
    contractAddress,
    HYPERSTAKE_CONTRACT.abi,
    signer
  );
  return contract as any;
}

export async function deployHyperStakeContract(
  wallet: ethers.Wallet,
  username: string,
  maxStakePerUserEther = 1
) {
  console.log("Deploying hyperstake contract...");
  const factory = ethers.ContractFactory.fromSolidity(
    HYPERSTAKE_CONTRACT,
    wallet
  );

  const params = [
    appConfig.linkTokenAddress,
    appConfig.oracleAddress,
    maxStakePerUserEther,
    username
  ];
  const contract = await factory.deploy(...params);

  await contract.deployed();
  console.log(`Hyperstake contract deployed at: ${contract.address}...`);
  return contract.address;
}
