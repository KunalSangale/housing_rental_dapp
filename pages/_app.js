import "@/styles/globals.css"
import { WagmiConfig, createClient } from "wagmi"
import { getDefaultProvider } from "ethers"
import { ThemeProvider } from "next-themes"
import { client } from "../wagmi"
import { NotificationProvider } from "@web3uikit/core"
import { Inter } from "@next/font/google"

const inter = Inter({ subsets: ["latin"] })
export default function App({ Component, pageProps }) {
    return (
        <WagmiConfig client={client}>
            <ThemeProvider attribute="class">
                <NotificationProvider>
                    <main className={inter.className}>
                        <Component {...pageProps} />
                    </main>
                </NotificationProvider>
            </ThemeProvider>
        </WagmiConfig>
    )
}
