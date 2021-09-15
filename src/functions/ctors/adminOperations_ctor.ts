import { IAdminOperationsCtor } from "../../interfaces/IAdminOperationsCtor";
import { formatAddress } from "../../utils/formatAddress";

/**
 * @description 특정 계정의 잔액을 설정
 * @param {string} address 지갑의 계정
 * @param {string} balance 추가할 잔액 (MDM)
 * @returns func, args
 */
export const setBalanceOf = (address: string, balance: string): IAdminOperationsCtor => ({
  func: "SetBalanceOf",
  args: JSON.stringify({
    args: ["-", formatAddress(address), balance || "1" + "0".repeat(21)],
  }),
});

/**
 * @description 특정 계정의 잔액을 조회
 * @param {string} address 지갑의 계정
 * @returns func, args
 */
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

/**
 * @description operation의 수수료를 조회
 * @param {string} opertaion 플랫폼의 특정 동작의 수수료 이름
 * @returns func, args
 */
export const getFee = (opertaion: string): IAdminOperationsCtor => ({
  func: "GetFee",
  args: JSON.stringify({ args: ["-", opertaion] }),
});

/**
 * @description operation의 수수료를 설정
 * @param {string} opertaion 플랫폼의 특정 동작의 수수료 이름
 * @param {string} fee 
 * @returns func, args
 */
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
