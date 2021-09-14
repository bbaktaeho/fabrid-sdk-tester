import { Wallets, X509Identity } from "fabric-network";
import FabricCAServices from "fabric-ca-client";
import path from "path";
import fs from "fs";
import { IEnv } from "../interfaces/IEnv";
import { config } from "../config";

export async function registerUser({ ccpPath, certificateAuthorities, mspId, adminId }: IEnv) {
  const enrollmentID = config.CLIENT_ID;
  const affiliation = config.AFFILIATION;

  try {
    let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    const caURL = ccp.certificateAuthorities[certificateAuthorities].url;
    const ca = new FabricCAServices(caURL);

    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userIdentity = await wallet.get(enrollmentID);
    if (userIdentity) {
      console.log('An identity for the user "appUser" already exists in the wallet');
      return;
    }

    const adminIdentity = await wallet.get(adminId);
    if (!adminIdentity) {
      console.log('An identity for the admin user "admin" does not exist in the wallet');
      console.log("Run the enrollAdmin.ts application before retrying");
      return;
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, adminId);

    const enrollmentSecret = await ca.register(
      {
        affiliation,
        enrollmentID,
        role: "client",
      },
      adminUser
    );
    const enrollment = await ca.enroll({
      enrollmentID,
      enrollmentSecret,
    });
    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId,
      type: "X.509",
    };
    await wallet.put(enrollmentID, x509Identity);
    console.log('Successfully registered and enrolled admin user "appUser" and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to register user "${enrollmentID}": ${error}`);
    process.exit(1);
  }
}
