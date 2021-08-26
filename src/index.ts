import { Env } from "./config";
import { enrollAdmin } from "./functions/enrollAdmin";
import { invoke } from "./functions/invoke";
import { query } from "./functions/query";
import { registerUser } from "./functions/registerUser";
import { sleep } from "./utils/sleep";

const ccpPath = Env.CCP_PATH;
const certificateAuthorities = Env.CERTIFICATE_AUTHORITIES;
const mspId = Env.MSP_ID;
const adminId = Env.ADMIN_ID;
const asLocalhost = Env.AS_LOCALHOST;

(async () => {
  await enrollAdmin({ ccpPath, adminId, certificateAuthorities, mspId });
  await registerUser({ ccpPath, adminId, certificateAuthorities, mspId });
  await invoke({ ccpPath, adminId, certificateAuthorities, mspId }, asLocalhost);
  await sleep(2);
  await query({ ccpPath, adminId, certificateAuthorities, mspId }, asLocalhost);
})();
