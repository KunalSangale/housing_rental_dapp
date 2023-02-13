import Head from "next/head"
import Navbar from "@/components/Navbar/Navbar"
import BrowseListings from "@/components/Listings/BrowseListings"

export default () => {
    return (
        <>
            <Head>
                <title>Rento</title>
                <meta name="description" content="Decentralized Housing Rental Platform" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <BrowseListings />
        </>
    )
}
