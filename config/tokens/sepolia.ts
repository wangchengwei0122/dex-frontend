import type { TokenConfig } from "../tokens"

/**
 * Ethereum Sepolia Testnet Token 配置
 */
export const SEPOLIA_TOKENS: TokenConfig[] = [
  {
    chainId: 11155111,
    address: "0x0000000000000000000000000000000000000000", // 约定原生 ETH
    symbol: "ETH",
    name: "Sepolia Ether",
    decimals: 18,
    isNative: true,
    wrappedAddress: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // Sepolia WETH
    canonical: {
      chainId: 1,
      address: "0x0000000000000000000000000000000000000000",
    },
    priority: 1,
    tags: ["bluechip"],
    logoURI: "/tokens/sepolia/ETH.png",
  },
  {
    chainId: 11155111,
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    canonical: {
      chainId: 1,
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    priority: 2,
    tags: ["bluechip"],
    logoURI: "/tokens/sepolia/WETH.png",
  },
  {
    chainId: 11155111,
    // USDC - Ethereum Sepolia（Circle 官方 & Uniswap 上线）
    // https://app.uniswap.org/explore/tokens/ethereum_sepolia/0x1c7d4b196cb0c7b01d743fbc6116a902379c7238
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    canonical: {
      chainId: 1,
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    priority: 3,
    isStable: true,
    tags: ["stable"],
    logoURI: "/tokens/sepolia/USDC.png",
  },
  {
    chainId: 11155111,
    // USDT - Ethereum Sepolia（Uniswap 上线）
    // https://app.uniswap.org/explore/tokens/ethereum_sepolia/0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0
    address: "0xaa8e23fb1079Ea71E0A56F48A2AA51851d8433d0",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    canonical: {
      chainId: 1,
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    priority: 4,
    isStable: true,
    tags: ["stable"],
    logoURI: "/tokens/sepolia/USDT.png",
  },
  {
    chainId: 11155111,
    // WBTC - Ethereum Sepolia（Uniswap 上线）
    // https://app.uniswap.org/explore/tokens/ethereum_sepolia/0x52eea312378ef46140ebe67de8a143ba2304fd7c
    address: "0x52eEa312378Ef46140EBe67dE8A143ba2304fD7c",
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
    canonical: {
      chainId: 1,
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    },
    priority: 5,
    tags: ["bluechip"],
    logoURI: "/tokens/sepolia/WBTC.png",
  },
  {
    chainId: 11155111,
    // UNI - Ethereum Sepolia（Uniswap 上线测试 Token）
    // https://app.uniswap.org/explore/tokens/ethereum_sepolia/0x75faf114eafb1bdbe2f0316df893fd58ce46aa4d
    address: "0x75fAF114Eafb1BDbe2F0316DF893fd58Ce46AA4d",
    symbol: "UNI",
    name: "Uniswap",
    decimals: 18,
    canonical: {
      chainId: 1,
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    },
    priority: 6,
    tags: ["defi"],
    logoURI: "/tokens/sepolia/UNI.png",
  },
  {
    chainId: 11155111,
    // LINK - Ethereum Sepolia（Chainlink 官方测试 Token）
    // https://docs.chain.link/resources/link-token-contracts
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    symbol: "LINK",
    name: "Chainlink",
    decimals: 18,
    canonical: {
      chainId: 1,
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    },
    priority: 7,
    tags: ["oracle", "defi"],
    logoURI: "/tokens/sepolia/LINK.png",
  },
  {
    chainId: 11155111,
    // DAI - Ethereum Sepolia（Uniswap 上线测试 Token）
    // https://app.uniswap.org/explore/tokens/ethereum_sepolia/0x68194a729c2450ad26072b3d33adacbcef39d574
    address: "0x68194A729C2450ad26072b3D33AdACbcef39D574",
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    canonical: {
      chainId: 1,
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    priority: 8,
    isStable: true,
    tags: ["stable"],
    logoURI: "/tokens/sepolia/DAI.png",
  },
  {
    chainId: 11155111,
    // AAVE - Ethereum Sepolia（Uniswap 上线测试 Token）
    // https://app.uniswap.org/explore/tokens/ethereum_sepolia/0x4a4f8c2c1d9c9f0b4f6a9a4d36d8c0a2a8cba6f1
    address: "0x4A4F8C2C1d9C9F0B4F6A9A4D36d8C0A2A8CBa6F1",
    symbol: "AAVE",
    name: "Aave Token",
    decimals: 18,
    canonical: {
      chainId: 1,
      address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DdAE9",
    },
    priority: 9,
    tags: ["defi", "lending"],
    logoURI: "/tokens/sepolia/AAVE.png",
  },
  {
    chainId: 11155111,
    // LDO - Ethereum Sepolia（Uniswap 上线测试 Token）
    // https://app.uniswap.org/explore/tokens/ethereum_sepolia/0x9f7b5f7b9a9d6e1b2e4f3b5d1c8f0a6e2d5b9f2c
    address: "0x9F7b5F7B9A9d6E1B2E4f3b5D1C8F0A6E2D5B9F2c",
    symbol: "LDO",
    name: "Lido DAO Token",
    decimals: 18,
    canonical: {
      chainId: 1,
      address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
    },
    priority: 10,
    tags: ["defi", "staking", "lsd"],
    logoURI: "/tokens/sepolia/LDO.png",
  },
]
