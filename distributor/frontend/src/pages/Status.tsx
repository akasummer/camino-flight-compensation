import UserSubmittedClaims from "@/components/UserSubmittedClaims";
import { connectWallet } from "@/util/connectWallet";
import { getRequestsForUser } from "@/util/getRequestsForUser";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const Status = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [requests, setRequests] = React.useState([]);

  const connect = async () => {
    setIsLoading(true);
    try {
      const acc = await connectWallet();
      setAccount(acc);
      const requests = await getRequestsForUser();
      setRequests(requests);
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Your claims</h2>
          <div className="flex gap-2 mt-2 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={connect}
              disabled={isLoading}
              className="flex items-center"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh list
            </Button>
          </div>
        </div>
        <UserSubmittedClaims requests={requests} />
      </main>
    </div>
  );
};

export default Status;
