import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useState, useEffect, use } from "react"
import { PulseLoader } from "react-spinners"
import { formatUnits, parseEther, parseUnits } from "@ethersproject/units"
import { useAccount, useContract, useSigner, useSignMessage } from "wagmi"
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs"
import { addressShorten } from "@/utils"
import { RxDotFilled } from "react-icons/rx"
import FeatureCard from "@/components/Listings/FeatureCard.js"
import Link from "next/link"
import contractAddress from "../../hardhat.json"
import { CheckCircleIcon } from "@heroicons/react/24/outline"
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import axios from "@/axiosConfig"
import housingConfig from "../../../hardhat-rental/artifacts/contracts/HousingRental.sol/HousingRental.json"
import { RxExternalLink } from "react-icons/rx"
var furnish_config = ["Fully Furnished", "Semi-Furnished", "Not Furnished"]
const statusConfig = ["Awaiting Signatures", "Awaiting Start Date", "Started", "Ended"]
const processLoadingConfig = [
    "",
    "Awaiting Signature",
    "Awaiting User Confirmation",
    "Awaiting Transaction Confirmation",
    "Signed Successfully",
    "Some Error Occured",
    "Transaction Successful",
    "Paying Rent",
]
export default (props) => {
    const [loading, setLoading] = useState(true)
    const [dataloading, setDataLoading] = useState(true)
    const { address } = useAccount()
    const [paymentLoading, setPaymentLoading] = useState(true)
    const [paymentData, setPayment] = useState(null)
    const [processLoading, setProcessLoading] = useState(0)
    const { data: signer, isError } = useSigner()
    const [isRent, setPayingRent] = useState(false)
    const { signMessageAsync } = useSignMessage()
    const [tempDate, setTempDate] = useState(null)
    const contract = useContract({
        address: contractAddress.deployed_at,
        abi: housingConfig.abi,
        signerOrProvider: signer,
    })
    const [slides, setSlides] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [rentData, setRent] = useState(null)
    const [paymentValue, setPaymentValue] = useState({
        totalDue: 0,
        month: 0,
        custom: 0,
    })
    const getPaymentData = async () => {
        setPaymentLoading(true)
        contract.getPaymentData(props.active.Listing.listing_index).then((r) => {
            setPayment(r)
            calculateDue(r)
            console.log(r)
            setPaymentLoading(false)
        })
    }

    const payRent = (value) => {
        if (rentData.tenant !== address) {
            alert("Only tenant can pay rent")
        }
        setPaymentValue({ ...paymentValue, custom: value })
        setPayingRent(true)
        setProcessLoading(2)
        contract
            .payRent(props.active.Listing.listing_index, { value: parseEther(value.toString()) })
            .then((e) => {
                setProcessLoading(3)
                e.wait(1)
                    .then((r) => {
                        setProcessLoading(6)
                        setTimeout(() => {
                            setProcessLoading(0)
                            setPayingRent(false)
                        }, 2000)
                    })
                    .catch((e) => {
                        setProcessLoading(5)
                        setTimeout(() => {
                            setProcessLoading(0)
                            setPayingRent(false)
                        }, 2000)
                    })
            })
            .catch((e) => {
                setProcessLoading(5)
                setTimeout(() => {
                    setProcessLoading(0)
                    setPayingRent(false)
                }, 2000)
            })
    }

    const calculateDue = (data) => {
        let totalDue = 0
        let currentTime = new Date()
        for (let x = 0; x < data.late.length; x++) {
            if (
                parseFloat(formatUnits(data.amountToBePaid[x])) > 0 &&
                currentTime.getTime() > parseInt(formatUnits(data.expectedDate[x], 0)) * 1000
            ) {
                console.log(
                    currentTime.getTime(),
                    parseInt(formatUnits(data.expectedDate[x], 0)) * 1000
                )
                totalDue += parseFloat(formatUnits(data.amountToBePaid[x], 18))
            }
        }
        let futureDate = new Date(currentTime.getTime() + 30 * 24 * 60 * 60 * 1000)
        let monthDue = 0
        for (let x = 0; x < data.late.length; x++) {
            if (
                parseFloat(formatUnits(data.amountToBePaid[x])) > 0 &&
                futureDate > new Date(parseInt(formatUnits(data.expectedDate[x], 0)) * 1000)
            ) {
                monthDue += parseFloat(formatUnits(data.amountToBePaid[x]))
            }
        }
        setPaymentValue({ ...paymentValue, totalDue: totalDue, month: monthDue })
    }

    useEffect(() => {
        if (rentData && rentData.status >= 2) {
            getPaymentData()
        }
    }, [rentData])

    const startTenure = async () => {
        setProcessLoading(2)
        contract
            .startAgreement(props.active.Listing.listing_index)
            .then((r) => {
                // alert("Started Successfully")
                setProcessLoading(3)
                r.wait(1)
                    .then(() => {
                        setProcessLoading(6)
                        setTimeout(() => setProcessLoading(0), 2000)
                    })
                    .catch((e) => {
                        setProcessLoading(5)
                        setTimeout(() => setProcessLoading(0), 2000)
                    })
                getRentData()
            })
            .catch((e) => {
                // alert("some error occurred")
                console.log(e)
            })
    }

    const signAgreement = async () => {
        if (
            props.active.asLandlord ||
            (props.active.asTenant && rentData.tenantSign !== "") ||
            (props.active.asResolver && rentData.resolverSign !== "")
        ) {
            return
        }
        setProcessLoading(1)
        signMessageAsync({
            message: "document hash:" + rentData.docHash,
        })
            .then((r) => {
                setProcessLoading(2)

                const result = contract
                    .signAgreement(props.active.Listing.listing_index, r, {
                        value: props.active.asTenant ? rentData.deposit : 0,
                    })
                    .then((res) => {
                        setProcessLoading(3)
                        res.wait(1)
                            .then((res) => {
                                setProcessLoading(4)
                                getRentData()

                                // alert("Signed Successfully")
                                setTimeout(() => setProcessLoading(0), 4000)
                            })
                            .catch((e) => {
                                setProcessLoading(5)
                                setTimeout(() => setProcessLoading(0), 4000)

                                console.log(e)
                            })
                    })
                    .catch((e) => {
                        setProcessLoading(5)
                        setTimeout(() => setProcessLoading(0), 4000)

                        console.log(e)
                    })
            })
            .catch((e) => {
                setProcessLoading(5)
                setTimeout(() => setProcessLoading(0), 4000)
                console.log(e)
            })
    }

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1
        setCurrentIndex(newIndex)
    }

    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1
        const newIndex = isLastSlide ? 0 : currentIndex + 1
        setCurrentIndex(newIndex)
    }

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex)
    }

    const getRentData = () => {
        // e.preventDefault()
        if (signer && signer !== null) {
            contract.rentalData(props.active.Listing.listing_index).then((result) => {
                console.log(result)
                setDataLoading(false)
                setRent(result)
                var d = new Date(parseInt(formatUnits(result.startDate, 0)) * 1000)
                console.log()
                setTempDate(d)
            })
        }
    }
    useEffect(getRentData, [signer, props.active.Listing.listing_index])

    useEffect(() => {
        if (!loading) setLoading(true)
        axios.get("/totalimages/" + props.active.Listing.metadata_id).then((responses) => {
            let newSlides = []
            for (let i = 0; i < responses.data; i++) {
                newSlides.push({
                    url:
                        "http://localhost/api/images/" +
                        props.active.Listing.metadata_id +
                        "?id=" +
                        (i + 1),
                })
            }
            setSlides(newSlides)
            setLoading(false)
        })
    }, [props.active.Listing.listing_index])
    return (
        <div className="flex flex-col">
            <div className="m-8 flex">
                <ChevronLeftIcon className="h-8 w-8" />
                <p className="text-xl uppercase tracking-wide font-bold select-none text-gray-700">
                    Rent Details
                </p>
            </div>
            {processLoading > 0 && (
                <div className="w-screen flex flex-col items-center justify-center bg-white top-0 left-0 z-[999] space-around space-y-8 h-screen absolute">
                    <p className="text-5xl font-semibold whitespace-nowrap ">Rento</p>
                    {isRent && (
                        <p className="uppercase font-bold text-3xl">ETH {paymentValue.custom}</p>
                    )}
                    {processLoading === 4 ||
                        (processLoading === 6 && <CheckCircleIcon className="h-8 w-8" />)}
                    {processLoading === 5 && <ExclamationCircleIcon className="h-8 w-8" />}
                    {processLoading < 4 && <PulseLoader />}
                    {isRent && <p className="uppercase font-bold text-md">Paying Rent</p>}
                    {isRent && (
                        <p className="uppercase font-bold text-md text-slate-600">
                            {props.active.Property.Address}
                        </p>
                    )}
                    <p className="text-xs text-slate-500 ">
                        Processing your transaction, please don't press back or refress button. You
                        will be redirected automatically after completion
                    </p>
                </div>
            )}
            {!loading && (
                <div className="max-w-[1400px] h-[500px] w-full m-auto  relative group">
                    <div
                        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
                        className="w-full h-full rounded-2xl bg-center bg-cover duration-500"
                    ></div>
                    {/* <Image
                            src={"http://localhost/api/images/" + listing_id + "?compressed=true"}
                            className="w-full h-full rounded-2xl bg-center bg-cover duration-500"
                            fill
                        /> */}
                    {/* <image
                            src={src}
                            className="w-full h-full rounded-2xl bg-center bg-cover duration-500"
                        ></image> */}
                    {/* Left Arrow */}
                    <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                        <BsChevronCompactLeft onClick={prevSlide} size={30} />
                    </div>
                    {/* Right Arrow */}
                    <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                        <BsChevronCompactRight onClick={nextSlide} size={30} />
                    </div>
                    <div className="flex top-4 justify-center py-2">
                        {slides.map((slide, slideIndex) => (
                            <div
                                key={slideIndex}
                                onClick={() => goToSlide(slideIndex)}
                                className="text-2xl cursor-pointer"
                            >
                                <RxDotFilled />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {loading && <PulseLoader />}
            <p className="text-md uppercase tracking-wide mx-auto font-bold select-none text-gray-700 w-4/5 mt-8">
                LISTING DETAILS
            </p>
            <div className="grid grid-cols-2  w-4/5 max-w-[1400px] m-auto ">
                <FeatureCard
                    title={props.active.Property.Address}
                    description={"Address"}
                ></FeatureCard>
                <FeatureCard title={props.active.Listing.bhk} description={"BHK"}></FeatureCard>
                <FeatureCard title={props.active.Property.Area} description={"Area"}></FeatureCard>
                <FeatureCard
                    title={furnish_config[props.active.Listing.furnish_status - 1]}
                    description={"Furnishing Status"}
                ></FeatureCard>
            </div>
            <div className="border-b w-3/5 mx-auto h-1 mt-4"></div>
            {!dataloading ? (
                <div>
                    <p className="text-md uppercase tracking-wide mx-auto font-bold select-none text-gray-700 w-4/5 mt-8">
                        Rent DETAILS
                    </p>
                    <div className="grid grid-cols-2  w-4/5 max-w-[1400px] m-auto ">
                        <FeatureCard
                            title={formatUnits(rentData.rent, 18) + " ETH"}
                            description={"Rent"}
                        ></FeatureCard>
                        <FeatureCard
                            title={formatUnits(rentData.deposit, 18) + " ETH"}
                            description={"Deposit"}
                        ></FeatureCard>
                        <FeatureCard
                            title={rentData.months + " months"}
                            description={"Tenure"}
                        ></FeatureCard>
                        <FeatureCard title={rentData.tenant} description={"Tenant"}></FeatureCard>

                        <FeatureCard
                            title={rentData.middleman}
                            description={"Dispute Resolver"}
                        ></FeatureCard>
                        <FeatureCard
                            title={statusConfig[rentData.status]}
                            description={"Status"}
                        ></FeatureCard>
                        <FeatureCard
                            title={
                                rentData.tenantSign !== ""
                                    ? addressShorten(rentData.tenantSign)
                                    : "Pending"
                            }
                            description={"Tenant Signature"}
                        ></FeatureCard>
                        <FeatureCard
                            title={
                                rentData.resolverSign !== ""
                                    ? addressShorten(rentData.resolverSign)
                                    : "Pending"
                            }
                            description={"Resolver Signature"}
                        ></FeatureCard>
                        <FeatureCard
                            title={tempDate.toLocaleDateString("en-GB")}
                            description={"Start Date"}
                        ></FeatureCard>
                    </div>
                    <div className="flex items-center justify-center">
                        <Link
                            href={{
                                pathname: "/listing/" + props.active.Listing.metadata_id,
                            }}
                            className="uppercase flex items-center space-around justify-center space-x-4 w-1/5 mx-auto h-10 text-center mt-4 font-bold text-xs text-slate-800 border shadow-md hover:bg-slate-200 rounded-full"
                        >
                            <RxExternalLink className="h-6 w-6 " />
                            View Listing details
                        </Link>
                        <div
                            className={
                                "uppercase flex items-center text-white space-around justify-center space-x-4 w-1/5 mx-auto py-3 text-center mt-4 font-bold text-xs text-slate-800 border shadow-md  rounded-full " +
                                (props.active.asLandlord || rentData.status > 0
                                    ? " bg-indigo-700 cursor-not-allowed"
                                    : "bg-blue-600 cursor-pointer hover:bg-blue-800")
                            }
                            onClick={signAgreement}
                        >
                            <p>Sign </p>
                        </div>
                        <div
                            className={
                                "uppercase flex items-center text-white space-around justify-center space-x-4 w-1/5 mx-auto py-3 text-center mt-4 font-bold text-xs text-slate-800 border shadow-md  rounded-full " +
                                (rentData.status == 1 && new Date().getTime() > tempDate
                                    ? "bg-blue-600 cursor-pointer hover:bg-blue-800"
                                    : " bg-indigo-700 cursor-not-allowed")
                            }
                            onClick={
                                new Date().getTime() > tempDate &&
                                rentData.status == 1 &&
                                startTenure
                            }
                        >
                            <p>Start Tenure </p>
                        </div>
                        <div
                            className={
                                "uppercase flex items-center text-white space-around justify-center space-x-4 w-1/5 mx-auto py-3 text-center mt-4 font-bold text-xs text-slate-800 border shadow-md  rounded-full " +
                                (new Date().getDate() + 30 * rentData.months > tempDate &&
                                rentData.status == 2
                                    ? "bg-red-600 cursor-pointer hover:bg-red-800"
                                    : " bg-indigo-700 cursor-not-allowed")
                            }
                        >
                            <p>End Agreement </p>
                        </div>
                    </div>

                    <p className="text-md uppercase tracking-wide mx-auto font-bold select-none text-gray-700 w-4/5 mt-8">
                        payment DETAILS
                    </p>
                    {paymentData !== null && (
                        <div className="flex flex-col w-4/5 mt-2 mx-auto">
                            <div className="grid grid-cols-5 w-full font-bold">
                                <p>Month</p>
                                <p>Amount to be Paid</p>
                                <p>Due Date</p>
                                <p>Is Payment Due</p>
                                <p>Late</p>
                            </div>
                            {paymentData.late.map((e, i) => {
                                return (
                                    <div className="grid grid-cols-5 w-full">
                                        <p>{i + 1}</p>
                                        <p>{formatUnits(paymentData.amountToBePaid[i], 18)}</p>
                                        <p>
                                            {new Date(
                                                parseInt(
                                                    formatUnits(paymentData.expectedDate[i], 0)
                                                ) * 1000
                                            ).toLocaleDateString("en-GB")}
                                        </p>
                                        <p>
                                            {new Date() >
                                            new Date(
                                                parseInt(
                                                    formatUnits(paymentData.expectedDate[i], 0)
                                                ) * 1000
                                            )
                                                ? "Due"
                                                : "Not due"}
                                        </p>
                                        <p>
                                            {parseInt(
                                                formatUnits(paymentData.amountToBePaid[i], 18)
                                            ) === 0 && e !== 1
                                                ? "On Time"
                                                : parseInt(
                                                      formatUnits(
                                                          paymentData.amountToBePaid[i],
                                                          18
                                                      )
                                                  ) > 0 && e == 2
                                                ? "Not Paid"
                                                : "LATE"}
                                        </p>
                                    </div>
                                )
                            })}
                            <div className="flex items-center justify-center">
                                <div
                                    className={
                                        "uppercase flex items-center text-white space-around justify-center space-x-4 w-1/5 mx-auto py-3 text-center mt-4 font-bold text-xs text-slate-800 border shadow-md  rounded-full " +
                                        (!props.active.asTenant
                                            ? " bg-indigo-700 cursor-not-allowed"
                                            : "bg-blue-600 cursor-pointer hover:bg-blue-800")
                                    }
                                    onClick={() => payRent(paymentValue.totalDue)}
                                >
                                    <p>Pay Overdue : {paymentValue.totalDue} </p>
                                </div>
                                <div
                                    className={
                                        "uppercase flex items-center text-white space-around justify-center space-x-4 w-1/5 mx-auto py-3 text-center mt-4 font-bold text-xs text-slate-800 border shadow-md  rounded-full " +
                                        (!props.active.asTenant
                                            ? " bg-indigo-700 cursor-not-allowed"
                                            : "bg-blue-600 cursor-pointer hover:bg-blue-800")
                                    }
                                    onClick={() => payRent(paymentValue.month)}
                                >
                                    <p>Pay Month : {paymentValue.month} </p>
                                </div>
                                <div
                                    className={
                                        "uppercase flex items-center text-white space-around justify-center space-x-4 w-1/5 mx-auto py-3 text-center mt-4 font-bold text-xs text-slate-800 border shadow-md  rounded-full " +
                                        (!props.active.asTenant
                                            ? " bg-indigo-700 cursor-not-allowed"
                                            : "bg-blue-600 cursor-pointer hover:bg-blue-800")
                                    }
                                    onClick={() => payRent(paymentValue.totalDue)}
                                >
                                    <p>Pay in Advance (Custom Value) </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <PulseLoader />
            )}
        </div>
    )
}
