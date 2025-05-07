
import React from "react";
import { useForm } from "@/context/FormContext";
import ItineraryForm from "@/components/ItineraryForm";
import FlightInfoForm from "@/components/FlightInfoForm";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import ClaimDetailsForm from "@/components/ClaimDetailsForm";
import StatusScreen from "@/components/StatusScreen";

const FormStepper: React.FC = () => {
  const { currentStep } = useForm();

  return (
    <div className="animate-fade-in">
      {currentStep === "ITINERARY" && <ItineraryForm />}
      {currentStep === "FLIGHT_INFO" && <FlightInfoForm />}
      {currentStep === "PERSONAL_INFO" && <PersonalInfoForm />}
      {currentStep === "CLAIM_DETAILS" && <ClaimDetailsForm />}
      {currentStep === "STATUS" && <StatusScreen />}
    </div>
  );
};

export default FormStepper;
