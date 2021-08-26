import { Env } from "./config";
import { enrollAdmin } from "./functions/enrollAdmin";
import { registerUser } from "./functions/registerUser";

const ccpPath = Env.CCP_PATH;
const certificateAuthorities = Env.CERTIFICATE_AUTHORITIES;
const mspId = Env.MSP_ID;
const adminId = Env.ADMIN_ID;

(async () => {
  await enrollAdmin({ ccpPath, adminId, certificateAuthorities, mspId });
  await registerUser({ ccpPath, adminId, certificateAuthorities, mspId });
})();
