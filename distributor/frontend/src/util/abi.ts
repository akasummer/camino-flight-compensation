export const CONTRACT_ABI = [
  "function getUserRequests(address user) view returns (uint256[])",

  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "getRequest",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        components: [
          {
            internalType: "string",
            name: "flightNumber",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "departureDate",
            type: "uint256",
          },
        ],
        internalType: "struct RequestProcessing.Flight[]",
        name: "flights",
        type: "tuple[]",
      },
      {
        internalType: "enum RequestProcessing.RequestStatus",
        name: "status",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  // Approve a request
  {
    inputs: [{ internalType: "uint256", name: "requestId", type: "uint256" }],
    name: "approveRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // Deny a request
  {
    inputs: [{ internalType: "uint256", name: "requestId", type: "uint256" }],
    name: "denyRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // Request more info
  {
    inputs: [{ internalType: "uint256", name: "requestId", type: "uint256" }],
    name: "requestMoreInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // Confirm additional info provided
  {
    inputs: [{ internalType: "uint256", name: "requestId", type: "uint256" }],
    name: "confirmInfoProvided",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // Mark as paid
  {
    inputs: [
      { internalType: "uint256", name: "requestId", type: "uint256" },
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "payRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // Fetch all requests (onlyOwner)
  {
    inputs: [],
    name: "getAllRequests",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
