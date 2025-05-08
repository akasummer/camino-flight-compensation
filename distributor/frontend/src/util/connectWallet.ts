export async function connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed.');
    }
  
    try {
      const accounts: string[] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
  
      if (accounts.length === 0) {
        throw new Error('No accounts found.');
      }
  
      return accounts[0];
    } catch (err: any) {
      throw new Error(err.message || 'Failed to connect wallet');
    }
  }