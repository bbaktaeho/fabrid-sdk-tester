import { Gateway, Wallets } from "fabric-network";
import path from "path";
import fs from "fs";
import { IEnv } from "../interfaces/IEnv";
import { config } from "../config";
import { getBalanceOf, setBalanceOf } from "./ctors/adminOperations_ctor";

export async function Balance({ ccpPath }: IEnv, asLocalhost: boolean) {
  const FUNCTION = "AdminOperations";
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
    const balance = "1" + "0".repeat(15);
    ctor = setBalanceOf(config.ACCOUNT, balance);
    result = await contract.submitTransaction(FUNCTION, ctor.func, ctor.args);
    console.log(`[Success] ${ctor.func} has been submitted: ${balance}`);
    ctor = getBalanceOf(config.ACCOUNT);
    result = await contract.evaluateTransaction(FUNCTION, ctor.func, ctor.args);
    console.log(`[Success] ${ctor.func} has been evaluated: ${result.toString()}`);

    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to ${FUNCTION} transaction: ${error}`);
    process.exit(1);
  }
}
