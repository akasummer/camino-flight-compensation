
import React, { useCallback, useEffect } from "react";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { airports } from "@/data/mockData";
import { Airport } from "@/types";

const ItineraryForm: React.FC = () => {
  const { 
    formData,
    goToNextStep,
    addAirportToItinerary,
    updateAirportInItinerary,
    removeAirportFromItinerary,
    generateFlightsFromItinerary,
  } = useForm();
  
  const validateForm = useCallback(() => {
    // Need at least 2 airports (departure and arrival)
    if (formData.itinerary.length < 2) {
      return false;
    }
    
    // All airports should be defined
    return formData.itinerary.every(item => item.airport !== null);
  }, [formData.itinerary]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      generateFlightsFromItinerary();
      goToNextStep();
    }
  };

  // Add initial airports if none exist
  useEffect(() => {
    if (formData.itinerary.length === 0) {
      // Add departure airport
      addAirportToItinerary(null);
      // Add arrival airport
      addAirportToItinerary(null);
    }
  }, [addAirportToItinerary, formData.itinerary.length]);
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Your Itinerary</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-600 mb-2">Add all the airports in your itinerary in order. For direct flights, you just need departure and arrival airports. For connecting flights, add all transit airports in the correct sequence.</p>
          </div>
          
          {formData.itinerary.map((item, index) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                    {index + 1}
                  </div>
                  <Label className="font-medium">
                    {index === 0 
                      ? "Departure Airport" 
                      : index === formData.itinerary.length - 1 
                        ? "Final Destination" 
                        : "Transit Airport"}
                  </Label>
                </div>
                <Select
                  value={item.airport?.id || ""}
                  onValueChange={(value) => {
                    const airport = airports.find((a) => a.id === value) || null;
                    updateAirportInItinerary(index, airport);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select airport" />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map((airport) => (
                      <SelectItem key={airport.id} value={airport.id}>
                        {airport.code} - {airport.name} ({airport.city})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {formData.itinerary.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-8"
                  onClick={() => removeAirportFromItinerary(index)}
                  disabled={formData.itinerary.length <= 2}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={() => addAirportToItinerary(null)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Transit Airport
          </Button>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button 
            type="submit" 
            disabled={!validateForm()}
          >
            Next: Flight Details
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ItineraryForm;
