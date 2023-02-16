import { useAccount, useConnect, useDisconnect } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { Connect } from "./Connect"
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import Nossr from "../Nossr"
import { useTheme } from "next-themes"
export default () => {
    const { systemTheme, theme, setTheme } = useTheme()
    const renderThemeChanger = () => {
        const currentTheme = theme === "system" ? systemTheme : theme
        if (currentTheme === "dark") {
            return (
                <SunIcon
                    className="h-6 w-6 text-gray-900 mr-3 dark:hover:bg-gray-700 dark:hover:text-white hover:text-blue-700 md:dark:hover:bg-transparent dark:text-gray-400 dark:border-gray-700"
                    role="button"
                    onClick={() => setTheme("light")}
                />
            )
        } else {
            return (
                <MoonIcon
                    className="h-6 w-6 text-gray-900 mr-3 dark:hover:bg-gray-700 dark:hover:text-white hover:text-blue-700 md:dark:hover:bg-transparent dark:text-gray-400 dark:border-gray-700"
                    role="button"
                    onClick={() => setTheme("dark")}
                />
            )
        }
    }
    return (
        <nav className="bg-white px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-600">
            <div className="container flex flex-wrap items-center justify-between mx-auto">
                <Link href="/" className="flex items-center">
                    {/* <img
                        src="https://flowbite.com/docs/images/logo.svg"
                        className="h-6 mr-3 sm:h-9"
                        alt="Rental Logo"
                    />   */}
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                        Rental
                    </span>
                </Link>
                <div className="flex md:order-2 items-center">
                    <Nossr>
                        {renderThemeChanger()}
                        <Connect />
                    </Nossr>
                    <button
                        data-collapse-toggle="navbar-sticky"
                        type="button"
                        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-sticky"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-6 h-6"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div
                    className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                    id="navbar-sticky"
                >
                    <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link
                                href="/"
                                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                                aria-current="page"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/browse"
                                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                            >
                                Browse
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/"
                                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                            >
                                List Property
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/kyc"
                                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                            >
                                KYC
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
