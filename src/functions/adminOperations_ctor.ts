import { IAdminOperationsCtor } from "../interfaces/IAdminOperationsCtor";
import { formatAddress } from "../utils/formatAddress";

export const setBalanceOf = (address: string, balance: string): IAdminOperationsCtor => ({
  func: "SetBalanceOf",
  args: JSON.stringify({
    args: ["-", formatAddress(address), balance || "1" + "0".repeat(21)],
  }),
});

export const getBalanceOf = (address: string): IAdminOperationsCtor => ({
  func: "GetBalanceOf",
  args: JSON.stringify({ args: ["-", formatAddress(address)] }),
});

export const getTransactionCount = (address: string): IAdminOperationsCtor => ({
  func: "GetTransactionCount",
  args: JSON.stringify({ args: ["-", address] }),
});

export const getTransaction = (txHash: string): IAdminOperationsCtor => ({
  func: "GetTransaction",
  args: JSON.stringify({ args: ["-", txHash] }),
});

export const getFee = (opertaion: string): IAdminOperationsCtor => ({
  func: "GetFee",
  args: JSON.stringify({ args: ["-", opertaion] }),
});

export const setFee = (opertaion: string, fee: string): IAdminOperationsCtor => ({
  func: "SetFee",
  args: JSON.stringify({ args: ["-", opertaion, fee] }),
});

export const getFeeCollector = (): IAdminOperationsCtor => ({
  func: "GetFeeCollector",
  args: JSON.stringify({ args: ["-"] }),
});

export const setFeeCollector = (feeCollector: string): IAdminOperationsCtor => ({
  func: "SetFeeCollector",
  args: JSON.stringify({ args: ["-", feeCollector] }),
});

export const setContractManagerOwner = (owner: string): IAdminOperationsCtor => ({
  func: "SetContractManagerOwner",
  args: JSON.stringify({ args: ["-", owner] }),
});
