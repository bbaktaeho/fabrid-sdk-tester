import { load } from "ts-dotenv";

export const ENV = load({
  CCP_PATH: String,
  MSP_ID: String,
  ENROLLMENT_ID: String,
  ENROLLMENT_SECRET: String,
  CERTIFICATE_AUTHORITIES: String,
});
