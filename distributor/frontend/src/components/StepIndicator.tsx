
import React from "react";
import { cn } from "@/lib/utils";
import { useForm } from "@/context/FormContext";
import { stepLabels } from "@/data/mockData";
import { Check } from "lucide-react";

const StepIndicator: React.FC = () => {
  const { currentStep } = useForm();
  
  const steps: Array<{ id: string; label: string }> = [
    { id: "FLIGHT_INFO", label: "Flight" },
    { id: "PERSONAL_INFO", label: "Personal" },
    { id: "CLAIM_DETAILS", label: "Claim" },
    { id: "STATUS", label: "Status" },
  ];

  const getStepStatus = (stepId: string) => {
    const currentIndex = Object.keys(stepLabels).indexOf(currentStep);
    const stepIndex = Object.keys(stepLabels).indexOf(stepId as keyof typeof stepLabels);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="step-indicator mb-8">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        
        return (
          <React.Fragment key={step.id}>
            <div className="step-indicator-item">
              <div 
                className={cn(
                  "step-indicator-circle transition-all duration-300",
                  status === "completed" ? "bg-primary text-white border-primary" : 
                  status === "current" ? "border-primary text-primary" : 
                  "border-gray-300 text-gray-400"
                )}
              >
                {status === "completed" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span 
                className={cn(
                  "text-xs mt-1 font-medium",
                  status === "completed" ? "text-primary" : 
                  status === "current" ? "text-primary" : 
                  "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "step-indicator-line",
                  status === "completed" ? "bg-primary" : "bg-gray-300"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
