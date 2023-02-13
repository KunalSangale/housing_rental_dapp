import { configureChains, createClient } from "wagmi"
import { goerli, mainnet, localhost } from "wagmi/chains"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"

import { publicProvider } from "wagmi/providers/public"

const { chains, provider, webSocketProvider } = configureChains(
    [localhost, mainnet, ...(process.env.NODE_ENV === "development" ? [goerli] : [])],
    [publicProvider()]
)

export const client = createClient({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({ chains }),
        new CoinbaseWalletConnector({
            chains,
            options: {
                appName: "rental",
            },
        }),
        new WalletConnectConnector({
            chains,
            options: {
                qrcode: true,
            },
        }),
        new InjectedConnector({
            chains,
            options: {
                name: "Injected",
                shimDisconnect: true,
            },
        }),
    ],
    provider,
    webSocketProvider,
})
