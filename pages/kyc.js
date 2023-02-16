import { useState } from "react"
import Head from "next/head"
import Navbar from "@/components/Navbar/Navbar"
import BrowseListings from "@/components/Listings/BrowseListings"
import PersonalInfo from "@/components/KYC/PersonalInfo"
import Nossr from "@/components/Nossr"
import Stage2 from "@/components/KYC/Stages/Stage2"
import Stage3 from "@/components/KYC/Stages/Stage3"
export default () => {
    const [stage, setStage] = useState(1)
    const [aadhar, setAadhar] = useState("")
    const handleStage = (direction) => {
        direction ? setStage(stage + 1) : setStage(stage - 1)
    }
    return (
        <>
            <Head>
                <title>Rento</title>
                <meta name="description" content="Decentralized Housing Rental Platform" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <Nossr>
                {stage == 1 && <PersonalInfo handleStage={(d) => handleStage(d)} />}
                {stage == 2 && (
                    <Stage2
                        handleStage={(d) => handleStage(d)}
                        aadhar={aadhar}
                        setAadhar={setAadhar}
                    />
                )}
                {stage == 3 && <Stage3 handleStage={(d) => handleStage(d)} aadhar={aadhar} />}
            </Nossr>
        </>
    )
}
