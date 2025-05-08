import { BrowserProvider, ethers } from 'ethers';

// Replace with your contract ABI and address

const CONTRACT_ABI = [
  'function payRequest(uint256 requestId) external payable',
];

export async function payRequest(requestId: number, amountInEth: number) {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Create contract instance
  const contract = new ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer,
  );

  // Convert amount to wei
  const amountInWei = ethers.parseEther(amountInEth.toString());

  // Call payRequest and send value
  const tx = await contract.payRequest(requestId, {
    value: amountInWei,
  });

  console.log('Transaction sent:', tx.hash);
  await tx.wait();
  console.log('Transaction confirmed');
}
