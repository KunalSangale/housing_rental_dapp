import "@/styles/globals.css"
import { WagmiConfig, createClient } from "wagmi"
import { getDefaultProvider } from "ethers"
import { ThemeProvider } from "next-themes"
import { darkTheme } from "@/theme/themes"
import { CssBaseline } from "@mui/joy"
import { client } from "../wagmi"
import { NotificationProvider } from "@web3uikit/core"
import { Inter } from "@next/font/google"
import "/styles/details.css"
import "/styles/featureCard.css"
import { CookiesProvider } from "react-cookie"
const inter = Inter({ subsets: ["latin"] })
export default function App({ Component, pageProps }) {
    return (
        <WagmiConfig client={client}>
            <ThemeProvider attribute="class">
                <CookiesProvider>
                    <NotificationProvider>
                        <main className={inter.className}>
                            <CssBaseline />
                            <Component {...pageProps} />
                        </main>
                    </NotificationProvider>
                </CookiesProvider>
            </ThemeProvider>
        </WagmiConfig>
    )
}
