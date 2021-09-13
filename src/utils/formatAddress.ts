export function formatAddress(address: string) {
  const prefix = address.substring(0, 2);
  let formatAddress = "";
  if (prefix == "0x" || prefix == "0X")
    formatAddress = address.substring(2).toLowerCase();
  else formatAddress = address.toLowerCase();

  return formatAddress;
}
