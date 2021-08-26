import FabricCAServices from "fabric-ca-client";
import { Wallets, X509Identity } from "fabric-network";
import fs from "fs";
import path from "path";
import { ENV } from "./config";

export async function enrollAdmin() {
  const ccpPath = ENV.CCP_PATH;
  const enrollmentID = ENV.ENROLLMENT_ID;
  const certificateAuthorities = ENV.CERTIFICATE_AUTHORITIES;
  const enrollmentSecret = ENV.ENROLLMENT_SECRET;
  const mspId = ENV.MSP_ID;

  try {
    // load the network configuration
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities[certificateAuthorities];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(enrollmentID);
    if (identity) {
      console.log(
        'An identity for the admin user "admin" already exists in the wallet'
      );
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
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
    console.log(
      'Successfully enrolled admin user "admin" and imported it into the wallet'
    );
  } catch (error) {
    console.error(`Failed to enroll admin user "${enrollmentID}": ${error}`);
    process.exit(1);
  }
}
