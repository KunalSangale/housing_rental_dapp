import Navbar from "@/components/Navbar/Navbar"
import MyProperties from "@/components/Listings/MyProperties"
import { useState } from "react"
import ListProperty from "@/components/Listings/ListProperty"
import Nossr from "@/components/Nossr"
export default () => {
    const [stage, setStage] = useState(0)
    const [activeProp, setActive] = useState(null)
    return (
        <>
            <Navbar />
            <Nossr>
                {stage === 0 && (
                    <MyProperties
                        changeActive={(e) => {
                            setActive(e)
                            setStage(1)
                        }}
                    />
                )}
                {stage === 1 && <ListProperty active={activeProp} goBack={() => setStage(0)} />}
            </Nossr>
        </>
    )
}
