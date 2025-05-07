
import React, { useCallback } from "react";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { flightNumbers } from "@/data/mockData";

const FlightInfoForm: React.FC = () => {
  const { 
    formData,
    goToNextStep,
    goToPreviousStep,
    updateFlightField,
  } = useForm();
  
  const validateForm = useCallback(() => {
    if (formData.flights.length === 0) return false;
    
    for (const flight of formData.flights) {
      if (!flight.departureDate || !flight.flightNumber) {
        return false;
      }
    }
    return true;
  }, [formData.flights]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      goToNextStep();
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Flight Details</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {formData.flights.map((flight, index) => {
            const departureAirportCode = flight.departureAirport?.code || '???';
            const arrivalAirportCode = flight.arrivalAirport?.code || '???';
            
            return (
              <div 
                key={flight.id} 
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <h3 className="font-medium mb-4">
                  Flight {index + 1}: {departureAirportCode} → {arrivalAirportCode}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`date-${flight.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id={`date-${flight.id}`}
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !flight.departureDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {flight.departureDate ? (
                            format(flight.departureDate, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={flight.departureDate || undefined}
                          onSelect={(date) => updateFlightField(flight.id, "departureDate", date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label htmlFor={`flight-number-${flight.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Flight Number
                    </label>
                    <Select
                      value={flight.flightNumber || ""}
                      onValueChange={(value) => updateFlightField(flight.id, "flightNumber", value)}
                    >
                      <SelectTrigger id={`flight-number-${flight.id}`}>
                        <SelectValue placeholder="Select flight number" />
                      </SelectTrigger>
                      <SelectContent>
                        {flightNumbers.map((number) => (
                          <SelectItem key={number} value={number}>
                            {number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            );
          })}
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

export default FlightInfoForm;
