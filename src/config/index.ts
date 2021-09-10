import { load } from "ts-dotenv";

export const Env = load({
  CCP_PATH: String,
  MSP_ID: String,
  ADMIN_ID: String,
  ADMIN_SECRET: String,
  CERTIFICATE_AUTHORITIES: String,
  CLIENT_ID: String,
  AFFILIATION: String,
  CHANNEL: String,
  CHAINCODE_NAME: String,
  AS_LOCALHOST: Boolean,
  ACCOUNT: String,
});
