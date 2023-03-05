import { PulseLoader } from "react-spinners"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Metamask } from "@web3uikit/icons"
import { Modal, CryptoLogos, Illustration } from "@web3uikit/core"
import { useTheme } from "next-themes"

export default (props) => {
    const { theme, systemTheme } = useTheme()
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
    const { connector, isConnected } = useAccount()
    const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark")
    if (isConnected) {
        props.setModal(false)
    }
    return (
        <Modal
            hasCancel={false}
            width="900px"
            okButtonColor={"blue"}
            onCancel={function noRefCheck() {
                props.setModal(false)
            }}
            onCloseButtonPressed={function noRefCheck() {
                props.setModal(false)
            }}
            onOk={function noRefCheck() {
                props.setModal(false)
            }}
            title={<p className="font-bold text-xl text-blue-500">Choose Wallet</p>}
            isVisible={props.isModalOpen}
            customize={{
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                border: "1px solid #4b5563",
            }}
            hasFooter={false}
        >
            <div className="mb-12 grid grid-cols-1 md:grid-cols-3 justify-items-center gap-y-6">
                {connectors
                    .filter((x) => x.ready && x.id !== connector?.id)
                    .map((x) => (
                        <div
                            className={
                                "w-60 h-60 rounded-lg border bg-gray-100 cursor-pointer hover:bg-gray-200 flex flex-col hover:border-slate-400 dark:bg-gray-800 dark:border-gray-600" +
                                (x.id === pendingConnector?.id ? " ring-2 ring-gray-400" : " ")
                            }
                            key={x.id}
                            onClick={() => connect({ connector: x })}
                        >
                            {x.name === "MetaMask" && (
                                <div className="basis-3/4 flex justify-center items-center">
                                    <Metamask fontSize="64px" />
                                </div>
                            )}
                            {x.name === "Coinbase Wallet" && (
                                <div className="basis-3/4 flex justify-center items-center">
                                    <CryptoLogos
                                        chain="coinbase"
                                        onClick={function noRefCheck() {}}
                                        size="64px"
                                    />
                                </div>
                            )}
                            {x.name === "WalletConnect" && (
                                <div className="basis-3/4 flex justify-center items-center">
                                    <svg
                                        fill="none"
                                        height="64"
                                        viewBox="0 0 400 400"
                                        width="64"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <clipPath id="a">
                                            <path d="m0 0h400v400h-400z" />
                                        </clipPath>
                                        <g clipPath="url(#a)">
                                            <circle
                                                cx="200"
                                                cy="200"
                                                fill="#3396ff"
                                                r="199.5"
                                                stroke="#66b1ff"
                                            />
                                            <path
                                                d="m122.519 148.965c42.791-41.729 112.171-41.729 154.962 0l5.15 5.022c2.14 2.086 2.14 5.469 0 7.555l-17.617 17.18c-1.07 1.043-2.804 1.043-3.874 0l-7.087-6.911c-29.853-29.111-78.253-29.111-108.106 0l-7.59 7.401c-1.07 1.043-2.804 1.043-3.874 0l-17.617-17.18c-2.14-2.086-2.14-5.469 0-7.555zm191.397 35.529 15.679 15.29c2.14 2.086 2.14 5.469 0 7.555l-70.7 68.944c-2.139 2.087-5.608 2.087-7.748 0l-50.178-48.931c-.535-.522-1.402-.522-1.937 0l-50.178 48.931c-2.139 2.087-5.608 2.087-7.748 0l-70.7015-68.945c-2.1396-2.086-2.1396-5.469 0-7.555l15.6795-15.29c2.1396-2.086 5.6085-2.086 7.7481 0l50.1789 48.932c.535.522 1.402.522 1.937 0l50.177-48.932c2.139-2.087 5.608-2.087 7.748 0l50.179 48.932c.535.522 1.402.522 1.937 0l50.179-48.931c2.139-2.087 5.608-2.087 7.748 0z"
                                                fill="#fff"
                                            />
                                        </g>
                                    </svg>
                                </div>
                            )}
                            {x.name === "Injected" && (
                                <div className="basis-3/4 flex justify-center items-center">
                                    <Illustration
                                        id=""
                                        logo="wallet"
                                        width={"64px"}
                                        height={"64px"}
                                    />
                                </div>
                            )}
                            {isLoading && x.id === pendingConnector?.id ? (
                                <PulseLoader
                                    color={isDark ? "#94a3b8" : "#475569"}
                                    className="m-auto basis-1/4"
                                    size={12}
                                />
                            ) : (
                                <p className="basis-1/4 text-center text-gray-600 dark:text-gray-400 text-lg font-bold">
                                    {x.name}
                                </p>
                            )}
                        </div>
                    ))}
            </div>
        </Modal>
    )
}
