import React, { useEffect } from "react";
import { FormProvider } from "@/context/FormContext";
import StepIndicator from "@/components/StepIndicator";
import FormStepper from "@/components/FormStepper";
import { connectWallet } from "@/util/connectWallet";

const Form: React.FC = () => {
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

  return (
    <FormProvider>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto py-4">
            <h1 className="text-2xl font-bold text-navy-800 text-center">
              Flight Claim Form
            </h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          {isLoading ? (
            <div className="flex justify-center items-center h-screen">
              Loading...
            </div>
          ) : !account ? (
            <>
              <div className="flex justify-center items-center h-screen">
                <button
                  onClick={connect}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Connect Wallet
                </button>
              </div>
            </>
          ) : (
            <>
              <StepIndicator />
              <div className="bg-white shadow-md rounded-lg p-6">
                <FormStepper />
              </div>
            </>
          )}
        </main>
        <footer className="bg-white py-4 mt-8 border-t">
          <div className="container mx-auto text-center text-gray-500 text-sm">
            &copy; 2025 Flight Claim Form. All rights reserved.
          </div>
        </footer>
      </div>
    </FormProvider>
  );
};

export default Form;
