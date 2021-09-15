import { Gateway, Wallets } from "fabric-network";
import path from "path";
import fs from "fs";
import { IEnv } from "../interfaces/IEnv";
import { config } from "../config";
import { getFee, setFee } from "./ctors/adminOperations_ctor";

export async function Fee({ ccpPath }: IEnv, asLocalhost: boolean) {
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
     * @description SetFee & GetFee
     */
    const operation = "MDM_TRANSFER";
    const fee = "1000";
    ctor = setFee(operation, fee);
    result = await contract.submitTransaction(FUNCTION, ctor.func, ctor.args);
    console.log(`[Success] ${ctor.func}(${operation}) has been submitted: ${fee}`);
    ctor = getFee(operation);
    result = await contract.evaluateTransaction(FUNCTION, ctor.func, ctor.args);
    console.log(`[Success] ${ctor.func}(${operation}) has been evaluated: ${result.toString()}`);
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to ${FUNCTION} transaction: ${error}`);
    process.exit(1);
  }
}
