import { Gateway, Wallets } from "fabric-network";
import path from "path";
import fs from "fs";
import { IEnv } from "../interfaces/IEnv";
import { Env } from "../config";
import { formatAddress } from "../utils/formatAddress";

export async function invoke({ ccpPath }: IEnv, asLocalhost: boolean) {
  const clientId = Env.CLIENT_ID;
  const channel = Env.CHANNEL;
  const chaincodeName = Env.CHAINCODE_NAME;

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

    const address = formatAddress(Env.ACCOUNT);
    // todo: your ctor of contract
    const args = {
      args: ["-", address, "1" + "0".repeat(21)],
    };
    const jsonArgs = JSON.stringify(args);
    await contract.submitTransaction(
      "AdminOperations",
      "SetBalanceOf",
      jsonArgs
    );

    console.log(`Transaction has been submitted`);
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
}
