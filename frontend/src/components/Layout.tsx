
import React from "react";
import { FormProvider } from "@/context/FormContext";
import StepIndicator from "@/components/StepIndicator";
import FormStepper from "@/components/FormStepper";

const Layout: React.FC = () => {
  return (
    <FormProvider>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto py-4">
            <h1 className="text-2xl font-bold text-navy-800 text-center">Flight Claim Navigator</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <StepIndicator />
          <div className="bg-white shadow-md rounded-lg p-6">
            <FormStepper />
          </div>
        </main>
        <footer className="bg-white py-4 mt-8 border-t">
          <div className="container mx-auto text-center text-gray-500 text-sm">
            &copy; 2025 Flight Claim Navigator. All rights reserved.
          </div>
        </footer>
      </div>
    </FormProvider>
  );
};

export default Layout;
