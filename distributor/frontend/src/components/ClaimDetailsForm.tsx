
import React, { useCallback, useState } from "react";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Upload, FileText } from "lucide-react";
import { disruptionReasons, compensations } from "@/data/mockData";
import { uploadFile } from "@/api/mockApi";
import { toast } from "@/components/ui/sonner";

const ClaimDetailsForm: React.FC = () => {
  const {
    formData,
    goToPreviousStep,
    addFellowPassenger,
    removeFellowPassenger,
    updateFellowPassenger,
    setDisruptionReason,
    setCompensation,
    setCommunicationDetails,
    setTicketFile,
    addEvidenceFile,
    removeEvidenceFile,
    submitForm,
    isSubmitting
  } = useForm();

  const [isUploading, setIsUploading] = useState(false);

  const validateForm = useCallback(() => {
    // Validate fellow passengers if any
    for (const passenger of formData.fellowPassengers) {
      if (!passenger.firstName || !passenger.lastName || !passenger.email) {
        return false;
      }
      
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(passenger.email)) return false;
    }
    
    // Validate required fields
    if (!formData.disruptionReason || !formData.compensation || !formData.ticketFile) {
      return false;
    }
    
    return true;
  }, [formData.fellowPassengers, formData.disruptionReason, formData.compensation, formData.ticketFile]);

  const handleTicketFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    try {
      const uploadedFile = await uploadFile(file);
      setTicketFile(uploadedFile);
      toast.success("Ticket file uploaded successfully");
    } catch (error) {
      console.error("Error uploading ticket file:", error);
      toast.error("Failed to upload ticket file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEvidenceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    try {
      const uploadedFile = await uploadFile(file);
      addEvidenceFile(uploadedFile);
      toast.success("Evidence file uploaded successfully");
    } catch (error) {
      console.error("Error uploading evidence file:", error);
      toast.error("Failed to upload evidence file");
    } finally {
      setIsUploading(false);
      // Clear the input value to allow uploading the same file again
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await submitForm();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Claim Details</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Fellow Passengers Section */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Fellow Passengers</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFellowPassenger}
                className="text-xs flex items-center"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Passenger
              </Button>
            </div>
            
            {formData.fellowPassengers.length > 0 ? (
              <div className="space-y-6">
                {formData.fellowPassengers.map((passenger, index) => (
                  <div 
                    key={passenger.id} 
                    className="border border-gray-200 rounded-lg p-4 relative bg-gray-50"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeFellowPassenger(passenger.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <h4 className="font-medium mb-3">Passenger {index + 1}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`fellow-first-name-${passenger.id}`}>First Name</Label>
                        <Input
                          id={`fellow-first-name-${passenger.id}`}
                          value={passenger.firstName}
                          onChange={(e) => updateFellowPassenger(passenger.id, "firstName", e.target.value)}
                          placeholder="First name"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`fellow-last-name-${passenger.id}`}>Last Name</Label>
                        <Input
                          id={`fellow-last-name-${passenger.id}`}
                          value={passenger.lastName}
                          onChange={(e) => updateFellowPassenger(passenger.id, "lastName", e.target.value)}
                          placeholder="Last name"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor={`fellow-email-${passenger.id}`}>Email Address</Label>
                        <Input
                          id={`fellow-email-${passenger.id}`}
                          type="email"
                          value={passenger.email}
                          onChange={(e) => updateFellowPassenger(passenger.id, "email", e.target.value)}
                          placeholder="Email address"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No fellow passengers added</p>
            )}
          </div>
          
          {/* Disruption Reason Section */}
          <div>
            <Label htmlFor="disruption-reason" className="text-base">Reason for Disruption</Label>
            <Select
              value={formData.disruptionReason?.id || ""}
              onValueChange={(value) => {
                const reason = disruptionReasons.find((r) => r.id === value) || null;
                setDisruptionReason(reason);
              }}
            >
              <SelectTrigger id="disruption-reason" className="mt-1">
                <SelectValue placeholder="Select reason for disruption" />
              </SelectTrigger>
              <SelectContent>
                {disruptionReasons.map((reason) => (
                  <SelectItem key={reason.id} value={reason.id}>
                    {reason.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.disruptionReason && (
              <p className="text-sm text-gray-500 mt-1">
                {formData.disruptionReason.description}
              </p>
            )}
          </div>
          
          {/* Compensation Section */}
          <div>
            <Label htmlFor="compensation" className="text-base">Compensation Offered</Label>
            <Select
              value={formData.compensation?.id || ""}
              onValueChange={(value) => {
                const compensation = compensations.find((c) => c.id === value) || null;
                setCompensation(compensation);
              }}
            >
              <SelectTrigger id="compensation" className="mt-1">
                <SelectValue placeholder="Select compensation offered" />
              </SelectTrigger>
              <SelectContent>
                {compensations.map((comp) => (
                  <SelectItem key={comp.id} value={comp.id}>
                    {comp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.compensation && (
              <p className="text-sm text-gray-500 mt-1">
                {formData.compensation.description}
              </p>
            )}
          </div>
          
          {/* Communication Details Section */}
          <div>
            <Label htmlFor="communication-details" className="text-base">Communication with Airline</Label>
            <Textarea
              id="communication-details"
              value={formData.communicationDetails}
              onChange={(e) => setCommunicationDetails(e.target.value)}
              placeholder="Describe any communication you've had with the airline about this issue"
              className="mt-1"
              rows={4}
            />
          </div>
          
          {/* File Upload Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Supporting Documents</h3>
            
            <div className="space-y-6">
              {/* Ticket Upload */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <Label htmlFor="ticket-file" className="text-base mb-2 block">
                  Boarding Pass / Ticket (Required)
                </Label>
                
                {formData.ticketFile ? (
                  <div className="flex items-center justify-between bg-white p-3 rounded border">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm truncate max-w-[200px]">{formData.ticketFile.name}</span>
                    </div>
                    <Button 
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setTicketFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg border-gray-300 bg-white">
                    <label 
                      htmlFor="ticket-file" 
                      className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                    >
                      <Upload className="h-6 w-6 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Upload your ticket</span>
                      <input
                        id="ticket-file"
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleTicketFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                )}
              </div>
              
              {/* Evidence Upload */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <Label className="text-base mb-2 block">
                  Additional Evidence (Optional)
                </Label>
                
                {formData.evidenceFiles.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {formData.evidenceFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between bg-white p-3 rounded border">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <Button 
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEvidenceFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg border-gray-300 bg-white">
                  <label 
                    htmlFor="evidence-file" 
                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                  >
                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload additional evidence</span>
                    <input
                      id="evidence-file"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleEvidenceFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
            </div>
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
            disabled={!validateForm() || isSubmitting || isUploading}
          >
            {isSubmitting ? "Submitting..." : "Submit Claim"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClaimDetailsForm;
