
import React, { useCallback } from "react";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PersonalInfoForm: React.FC = () => {
  const { 
    formData, 
    goToNextStep, 
    goToPreviousStep,
    updateMainPassenger
  } = useForm();

  const validateForm = useCallback(() => {
    const { firstName, lastName, email } = formData.mainPassenger;
    if (!firstName || !lastName || !email) return false;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    
    return true;
  }, [formData.mainPassenger]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      goToNextStep();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <Label htmlFor="firstName" className="text-base">First Name</Label>
            <Input
              id="firstName"
              value={formData.mainPassenger.firstName}
              onChange={(e) => updateMainPassenger("firstName", e.target.value)}
              placeholder="Enter your first name"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="lastName" className="text-base">Last Name</Label>
            <Input
              id="lastName"
              value={formData.mainPassenger.lastName}
              onChange={(e) => updateMainPassenger("lastName", e.target.value)}
              placeholder="Enter your last name"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="text-base">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.mainPassenger.email}
              onChange={(e) => updateMainPassenger("email", e.target.value)}
              placeholder="Enter your email address"
              className="mt-1"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              We'll use this email to keep you updated about your claim.
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={goToPreviousStep}
          >
            Back
          </Button>
          
          <Button 
            type="submit" 
            disabled={!validateForm()}
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
