import { InputNew as Input } from "@web3uikit/core"
import { Search } from "@web3uikit/icons"
import { useTheme } from "next-themes"

// import { url } from "inspector"
export default () => {
    const { theme, systemTheme } = useTheme()
    const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark")
    return (
        <div className="items-center h-screen flex flex-col bg-cover">
            <div
                className="absolute -z-10 h-screen w-screen"
                style={
                    !isDark
                        ? {
                              backgroundColor: `#ffffff`,
                              opacity: 0.1,
                              backgroundImage: `repeating-radial-gradient( circle at 220px 0, transparent 0, #ffffff 40px ), repeating-linear-gradient( #5082ef55, #5082ef )`,
                          }
                        : {
                              backgroundColor: "#1c1b22",
                              opacity: 0.03,
                              backgroundImage: `repeating-radial-gradient( circle at 2200 0, transparent 0, #000000 40px ), repeating-linear-gradient( #00000055, #1c1b22 )`,
                          }
                }
            ></div>
            <p className="font-extrabold text-5xl text-slate-800 mt-60 m-4 z-2 dark:text-slate-100">
                Decentralized Housing Rental Platform
            </p>
            <div className="w-full max-w-2xl mt-4">
                <Input
                    customize={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #FFFFFF",
                        borderRadius: "16px",
                        color: "#1e293b",
                        fontSize: "16px,",
                        margin: "20px 0px",
                        onHover: "lighten",
                        padding: "16px 10px",
                        // maxWidth: "90%",
                    }}
                    label="Search"
                    placeholder="Find Properties"
                    setLabelMargin={{
                        left: "40px",
                        right: "40px",
                    }}
                    slots={{
                        slotBefore: [<Search fontSize="20px" color="#1e293b" />],
                    }}
                />
            </div>
        </div>
    )
}
