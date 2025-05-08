import { BigNumberish, BrowserProvider, Contract } from 'ethers';
import { Request } from './getRequestsForUser';

const CONTRACT_ABI = [
  {
    inputs: [],
    name: 'getAllRequests',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
    ],
    name: 'getRequest',
    outputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'requester',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'flightNumber',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'departureDate',
            type: 'uint256',
          },
        ],
        internalType: 'struct RequestProcessing.Flight[]',
        name: 'flights',
        type: 'tuple[]',
      },
      {
        internalType: 'enum RequestProcessing.RequestStatus',
        name: 'status',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export async function getAllRequests(): Promise<Request[]> {
  if (!window.ethereum) throw new Error('MetaMask not found');

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer,
  );

  const requestIds: BigNumberish[] = await contract.getAllRequests();

  const requestPromises = requestIds.map((id: BigNumberish) =>
    contract.getRequest(id).then((result: any) => ({
      id: result.id,
      requester: result.requester,
      flights: result.flights.map((flight: any) => ({
        flightNumber: flight.flightNumber,
        departureDate: BigInt(flight.departureDate),
      })),
      status: result.status,
    })),
  );

  return Promise.all(requestPromises);
}
