
import { connectWallet } from "@/util/connectWallet";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Status = () => {
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [account, setAccount] = React.useState(null);

  const connect = async () => {
    setIsLoading(true);
    try {
      const acc = await connectWallet();
      setAccount(acc);
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;
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
    <div>
      Connected to account: {account}
    </div>
  );
};

export default Status;
