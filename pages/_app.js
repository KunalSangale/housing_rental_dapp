import "@/styles/globals.css"
import { WagmiConfig, createClient } from "wagmi"
import { getDefaultProvider } from "ethers"
import { ThemeProvider } from "next-themes"
import { client } from "../wagmi"

export default function App({ Component, pageProps }) {
    return (
        <WagmiConfig client={client}>
            <ThemeProvider attribute="class">
                <Component {...pageProps} />
            </ThemeProvider>
        </WagmiConfig>
    )
}
