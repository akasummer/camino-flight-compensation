import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ABI } from "./abi";

export const updateRequestStatus = async (
  requestId: number,
  newStatus: number
): Promise<void> => {
  if (!window.ethereum) throw new Error("MetaMask not found");

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  );

  let tx;

  switch (newStatus) {
    case 1: // Approved
      tx = await contract.approveRequest(requestId);
      break;
    case 2: // Denied
      tx = await contract.denyRequest(requestId);
      break;
    case 3: // NeedMoreInfo
      tx = await contract.requestMoreInfo(requestId);
      break;
    case 4:
      // TODO: implement payment
      break;
    case 0: // Pending (after info provided)
      tx = await contract.confirmInfoProvided(requestId);
      break;
    default:
      throw new Error("Unsupported status update");
  }

  await tx.wait();
};
