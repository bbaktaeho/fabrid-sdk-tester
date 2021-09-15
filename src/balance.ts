import { config } from "./config";
import { enrollAdmin } from "./functions/enrollAdmin";
import { registerUser } from "./functions/registerUser";
import { setBalance } from "./functions/setBalance";
import { IEnv } from "./interfaces/IEnv";

const DEFAULT_ENV: IEnv = {
  adminId: config.ADMIN_ID,
  ccpPath: config.CCP_PATH,
  certificateAuthorities: config.CERTIFICATE_AUTHORITIES,
  mspId: config.MSP_ID,
};
const AS_LOCALHOST = config.AS_LOCALHOST;

(async () => {
  await enrollAdmin(DEFAULT_ENV);
  await registerUser(DEFAULT_ENV);

  console.log("-".repeat(10) + "Balance Setting" + "-".repeat(10));
  await setBalance(DEFAULT_ENV, AS_LOCALHOST);
})();
