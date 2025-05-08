import { ethers } from "ethers";
import { CONTRACT_ABI } from "./abi";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

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
