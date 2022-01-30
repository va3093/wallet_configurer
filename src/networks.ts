export interface NetworkConfig {
  chainId: number;
  chainName: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  iconUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

const networks: Record<string, NetworkConfig> = {
  polygon_mainnet: {
    chainId: 137,
    chainName: "Polygon",
    blockExplorerUrls: ["https://polygonscan.com"],
    iconUrls: [],
    rpcUrls: ["https://polygon-rpc.com"],
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  arbitrum_one: {
    chainId: 42161,
    chainName: "Arbitrum One",
    iconUrls: [],
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"],
    nativeCurrency: {
      name: "Aeth",
      symbol: "AETH",
      decimals: 18,
    },
  },
  avalanch: {
    chainId: 43114,
    chainName: "Avalanche Network",
    iconUrls: [],
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io/"],
    nativeCurrency: {
      name: "Avax",
      symbol: "AVAX",
      decimals: 18,
    },
  },
};
export default networks;
