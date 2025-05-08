import { ethers } from "ethers";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const CONTRACT_ABI = [
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
];

export enum RequestStatus {
  Pending = 0,
  Approved = 1,
  Denied = 2,
  NeedMoreInfo = 3,
  Paid = 4,
}

export interface Flight {
  flightNumber: string;
  departureDate: bigint; // Use bigint for uint256 values
}

export interface Request {
  id: bigint;
  requester: string;
  flights: Flight[];
  status: RequestStatus;
}

export async function getRequestsForUser(): Promise<Request[]> {
  if (!window.ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    provider
  );

  const requestIds: ethers.BigNumberish[] = await contract.getUserRequests(
    userAddress
  );

  const requestPromises = requestIds.map((id: ethers.BigNumberish) =>
    contract.getRequest(id).then((result: any) => ({
      id: result.id,
      requester: result.requester,
      flights: result.flights.map((flight: any) => ({
        flightNumber: flight.flightNumber,
        departureDate: BigInt(flight.departureDate),
      })),
      status: result.status,
    }))
  );

  return Promise.all(requestPromises);
}
