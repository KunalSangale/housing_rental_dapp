import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Modal } from "@web3uikit/core"
import { useState } from "react"
import { Typography } from "@web3uikit/core"
export function Connect() {
    const { connector, isConnected } = useAccount()
    const { connect, connectors, error, isLoading, pendingConnector } =
        useConnect()
    const { disconnect } = useDisconnect()
    const [isModalOpen, setModal] = useState(false)
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
                    title={
                        <p className="font-bold text-xl text-blue-700">
                            Choose Wallet
                        </p>
                    }
                    isVisible={isModalOpen}
                >
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 ">
                        {connectors
                            .filter((x) => x.ready && x.id !== connector?.id)
                            .map((x) => (
                                <div
                                    className="w-60 h-60 rounded-lg bg-gray-100 cursor-pointer flex flex-col"
                                    key={x.id}
                                    onClick={() => connect({ connector: x })}
                                >
                                    <div className="basis-3/4"></div>
                                    <p className="basis-1/4 text-center font-extrabold">
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

            {error && <div>{error.message}</div>}
        </div>
    )
}
