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
            
            {/* <div className="w-full max-w-2xl mt-4">
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
            </div> */}
       {/* <div class=" min-h-screen bg-gray-100 flex justify-center items-center"> */}
	<div class="w-full max-w-2xl mt-4 ">
		<form>
				<div class="sm:flex items-center bg-white rounded-lg overflow-hidden px-2 py-1 justify-between border-2 border-gray-200">
					<input class="text-base text-gray-600 flex-grow outline-none px-2 " type="text" placeholder="Find Properties" />
					<div class="ms:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
						<select id="Budget" class="text-base text-gray-800 outline-none border-2 px-4 py-2 rounded-lg">
            <option value="" selected>Budget</option>
            <option value="0.2"> &lt; 0.2 ETH</option>
            <option value="0.5">&lt; 0.5 ETH</option>
            <option value="0.7">&lt; 0.7 ETH</option>
            <option value="1">&lt; 1 ETH</option>
          </select>
          <select id="BHK" class="text-base text-gray-800 outline-none border-2 px-4 py-2 rounded-lg">
            <option value="" selected>BHK Type</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4 BHK</option>
          </select>
          
		<button class="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
					</div>
				</div>
		</form>
	</div>
{/* </div> */}
        </div>
    )
}
