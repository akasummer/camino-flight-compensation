import { BrowserProvider, Contract } from 'ethers';

export async function getContractOwnership(): Promise<string> {
  if (!window.ethereum) throw new Error('MetaMask not found');

  const provider = new BrowserProvider(window.ethereum);

  const contract = new Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    ['function owner() view returns (address)'],
    provider,
  );

  const owner = await contract.owner();

  return owner;
}

export async function isContractOwner(): Promise<boolean> {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  const owner = await getContractOwnership();

  return owner.toLowerCase() === userAddress.toLowerCase();
}
