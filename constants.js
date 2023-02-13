const abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "Rental__InvalidSlice",
        type: "error",
    },
    {
        inputs: [],
        name: "Rental__OutOfRange",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint16",
                name: "id",
                type: "uint16",
            },
            {
                components: [
                    {
                        internalType: "uint16",
                        name: "id",
                        type: "uint16",
                    },
                    {
                        internalType: "address",
                        name: "landlord",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "deposit",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "rent",
                        type: "uint256",
                    },
                    {
                        internalType: "uint8",
                        name: "months",
                        type: "uint8",
                    },
                    {
                        internalType: "bool",
                        name: "isRentEth",
                        type: "bool",
                    },
                    {
                        internalType: "string",
                        name: "metadataID",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "metadataHash",
                        type: "string",
                    },
                ],
                indexed: false,
                internalType: "struct HousingRental.Listing",
                name: "newListing",
                type: "tuple",
            },
            {
                indexed: false,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "ListingCreated",
        type: "event",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint16",
                        name: "id",
                        type: "uint16",
                    },
                    {
                        internalType: "address",
                        name: "landlord",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "deposit",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "rent",
                        type: "uint256",
                    },
                    {
                        internalType: "uint8",
                        name: "months",
                        type: "uint8",
                    },
                    {
                        internalType: "bool",
                        name: "isRentEth",
                        type: "bool",
                    },
                    {
                        internalType: "string",
                        name: "metadataID",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "metadataHash",
                        type: "string",
                    },
                ],
                internalType: "struct HousingRental.Listing",
                name: "newListing",
                type: "tuple",
            },
        ],
        name: "createListing",
        outputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "cursor",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "size",
                type: "uint16",
            },
        ],
        name: "getListings",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint16",
                        name: "id",
                        type: "uint16",
                    },
                    {
                        internalType: "address",
                        name: "landlord",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "deposit",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "rent",
                        type: "uint256",
                    },
                    {
                        internalType: "uint8",
                        name: "months",
                        type: "uint8",
                    },
                    {
                        internalType: "bool",
                        name: "isRentEth",
                        type: "bool",
                    },
                    {
                        internalType: "string",
                        name: "metadataID",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "metadataHash",
                        type: "string",
                    },
                ],
                internalType: "struct HousingRental.Listing[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getOwner",
        outputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
]

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export { abi, contractAddress }
