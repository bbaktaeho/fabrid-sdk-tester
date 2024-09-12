import { Gateway, Wallets } from "fabric-network";
import path from "path";
import fs from "fs";
import { IEnv } from "../interfaces/IEnv";
import { config } from "../config";

export async function query({ ccpPath }: IEnv, asLocalhost: boolean) {
  const clientId = config.CLIENT_ID;
  const channel = config.CHANNEL;
  const chaincodeName = config.CHAINCODE_NAME;

  try {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(clientId);
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.ts application before retrying");
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: clientId,
      discovery: { enabled: true, asLocalhost },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channel);

    // Get the contract from the network.
    const contract = network.getContract(chaincodeName);

    // todo: your ctor of contract
    const args = { args: ["-", config.ACCOUNT] };
    const jsonArgs = JSON.stringify(args);

    const result = await contract.evaluateTransaction(
      "AdminOperations",
      "GetBalanceOf",
      jsonArgs
    );
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
}
