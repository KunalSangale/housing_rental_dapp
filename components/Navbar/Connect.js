import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Modal, CryptoLogos, Illustration } from "@web3uikit/core"
import { useState } from "react"
import { Metamask } from "@web3uikit/icons"
export function Connect() {
    const { connector, isConnected } = useAccount()
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
    const { disconnect } = useDisconnect()
    const [isModalOpen, setModal] = useState(false)
    console.log(connectors)
    return (
        <div>
            <div>
                {isConnected && (
                    <button
                        type="button"
                        onClick={() => disconnect()}
                        className="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Disconnect {connector.name}
                    </button>
                )}
                {!isConnected && (
                    <button
                        type="button"
                        onClick={() => setModal(true)}
                        className="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Connect
                    </button>
                )}
                <Modal
                    hasCancel={false}
                    width="900px"
                    okButtonColor={"blue"}
                    onCancel={function noRefCheck() {
                        setModal(false)
                    }}
                    onCloseButtonPressed={function noRefCheck() {
                        setModal(false)
                    }}
                    onOk={function noRefCheck() {
                        setModal(false)
                    }}
                    title={<p className="font-bold text-xl text-blue-600">Choose Wallet</p>}
                    isVisible={isModalOpen}
                >
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 justify-items-center gap-y-6">
                        {connectors
                            .filter((x) => x.ready && x.id !== connector?.id)
                            .map((x) => (
                                <div
                                    className={
                                        "w-60 h-60 rounded-lg border bg-gray-100 cursor-pointer hover:bg-gray-200 flex flex-col hover:border-slate-400 " +
                                        (x.id === pendingConnector?.id
                                            ? " ring-2 ring-blue-400"
                                            : " ")
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
                                    <p className="basis-1/4 text-center text-lg font-bold">
                                        {x.name}
                                        {isLoading &&
                                            x.id === pendingConnector?.id &&
                                            " (connecting)"}
                                    </p>
                                </div>
                            ))}
                    </div>
                </Modal>

                {/* {connectors
                    .filter((x) => x.ready && x.id !== connector?.id)
                    .map((x) => (
                        <button
                            key={x.id}
                            onClick={() => connect({ connector: x })}
                        >
                            {x.name}
                            {isLoading &&
                                x.id === pendingConnector?.id &&
                                " (connecting)"}
                        </button>
                    ))} */}
            </div>

            {/* {error && <div>{error.message}</div>} */}
        </div>
    )
}