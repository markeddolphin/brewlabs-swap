export const balanceQuery = `
query($network: EthereumNetwork!,$address: String!)
{
  ethereum(network: $network) {
    address(address: {is: $address}) {
      balances {
        value
        currency {
          address
          decimals
          name
          symbol
        }
      }
    }
  }
}


`;
