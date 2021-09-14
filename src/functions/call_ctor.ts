import { ICtor } from "../interfaces/ICtor";

type CallJson = {
  from: string;
  gas: string;
  gasPrice: string;
  to: string;
  value: string;
  data: string;
};

export const call = (callJson: CallJson): ICtor => ({
  args: JSON.stringify({ args: [callJson] }),
});
