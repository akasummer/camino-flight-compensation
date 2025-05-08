import StatusScreen from "@/components/StatusScreen";
import { connectWallet } from "@/util/connectWallet";
import { getRequestsForUser } from "@/util/getRequestsForUser";
import React, { useEffect } from "react";

const Status = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [account, setAccount] = React.useState(null);

  const connect = async () => {
    setIsLoading(true);
    try {
      const acc = await connectWallet();
      setAccount(acc);
      const requests = await getRequestsForUser(); 
      console.log(`Requests for user ${acc}:`, requests);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    connect();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {error.message}
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex justify-center items-center h-screen">
        <button
          onClick={connect}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold text-navy-800 text-center">
            Flight Claim Form
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <StatusScreen />
      </main>
    </div>
  );
};

export default Status;
