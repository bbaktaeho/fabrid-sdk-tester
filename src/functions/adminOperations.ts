import { Gateway, Wallets } from "fabric-network";
import path from "path";
import fs from "fs";
import { IEnv } from "../interfaces/IEnv";
import { config } from "../config";
import {
  getBalanceOf,
  getFee,
  getFeeCollector,
  getTransactionCount,
  setBalanceOf,
  setContractManagerOwner,
  setFee,
  setFeeCollector,
} from "./adminOperations_ctor";
import { rand } from "../utils/random";
import { formatAddress } from "../utils/formatAddress";

export async function AdminOperations({ ccpPath }: IEnv, asLocalhost: boolean) {
  const FUNCTION = this.AdminOperations.name;
  const clientId = config.CLIENT_ID;
  const channel = config.CHANNEL;
  const chaincodeName = config.CHAINCODE_NAME;

  try {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get(clientId);
    if (!identity) {
      console.log(`An identity for the user "${clientId}" does not exist in the wallet`);
      console.log("Run the registerUser.ts application before retrying");
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: clientId,
      discovery: { enabled: true, asLocalhost },
    });

    const network = await gateway.getNetwork(channel);
    const contract = network.getContract(chaincodeName);

    let ctor;
    let result;

    /**
     * @description SetBalanceOf & GetBalanceOf
     */
    const balance = "5" + "0".repeat(27);
    ctor = setBalanceOf(config.ACCOUNT, balance);
    result = await contract.submitTransaction(FUNCTION, ctor.func, ctor.args);
    console.log(`[Success] ${ctor.func} has been submitted: ${balance}`);
    ctor = getBalanceOf(config.ACCOUNT);
    result = await contract.evaluateTransaction(FUNCTION, ctor.func, ctor.args);
    console.log(`[Success] ${ctor.func} has been evaluated: ${result.toString()}`);

    /**
     * @description GetTranscationCount
     */
    ctor = getTransactionCount(config.ACCOUNT);
    result = await contract.evaluateTransaction(FUNCTION, ctor.func, ctor.args);
    console.log(`[Success] ${ctor.func} has been evaluated: ${result.toString()}`);

    /**
     * @description SetFee & GetFee
     */
    for (const operation of ["MDM_TRANSFER", "ERC20_TRANSFER", "BRIDGE_TRANSFER", "ERC20_DEPLOY", "UNKNOWN"]) {
      const randomString = rand(100).toString();
      ctor = setFee(operation, randomString);
      result = await contract.submitTransaction(FUNCTION, ctor.func, ctor.args);
      console.log(`[Success] ${ctor.func}(${operation}) has been submitted: ${randomString}`);
      ctor = getFee(operation);
      result = await contract.evaluateTransaction(FUNCTION, ctor.func, ctor.args);
      console.log(`[Success] ${ctor.func}(${operation}) has been evaluated: ${result.toString()}`);
    }

    /**
     * @description SetFeeCollector & GetFeeCollector
     */
    ctor = getFeeCollector();
    result = await contract.evaluateTransaction(FUNCTION, ctor.func, ctor.args);
    console.log(`[Success] ${ctor.func} has been evaluated: ${result.toString()}`);
    const collector = "00" + rand(9).toString().repeat(38);
    ctor = setFeeCollector(collector);
    result = await contract.submitTransaction(FUNCTION, ctor.func, ctor.args);
    console.log(`[Success] ${ctor.func} has been submitted: ${collector}`);
    ctor = getFeeCollector();
    result = await contract.evaluateTransaction(FUNCTION, ctor.func, ctor.args);
    console.log(`[Success] ${ctor.func} has been evaluated: ${result.toString()}`);

    /**
     * @description SetContractManagerOwner
     */
    const owner = formatAddress("0x46ce33ED39119D5b9A73d146ED9DD6a7BC53F72b");
    ctor = setContractManagerOwner(owner);
    result = await contract.submitTransaction(FUNCTION, ctor.func, ctor.args);
    console.log(`[Success] ${ctor.func} has been submitted: ${owner}`);

    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to ${FUNCTION} transaction: ${error}`);
    process.exit(1);
  }
}
