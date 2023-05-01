import DashboardSidebar from "@/components/Dashboard/DashboardSidebar"
// import MyProperties from "@/components/Listings/MyProperties"
import Navbar from "@/components/Navbar/Navbar"
import { useState } from "react"
import DashboardProps from "@/components/Listings/DashboardProps"
import DashboardActive from "@/components/Dashboard/DashboardActive"
export default () => {
    const [activeTab, setActive] = useState(0)
    return (
        <>
            <Navbar />
            <div className="w-full h-screen flex ">
                <DashboardSidebar active={activeTab} setActive={setActive} />
                {activeTab == 1 && <DashboardProps />}
                {activeTab == 0 && <DashboardActive />}
            </div>
        </>
    )
}
