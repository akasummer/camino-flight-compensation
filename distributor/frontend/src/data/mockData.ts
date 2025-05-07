
import { Airport, DisruptionReason, Compensation, ClaimStatus, FormStep } from "@/types";

export const airports: Airport[] = [
  { id: "1", code: "LHR", name: "Heathrow Airport", city: "London", country: "United Kingdom" },
  { id: "2", code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
  { id: "3", code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "United States" },
  { id: "4", code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "United States" },
  { id: "5", code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "United Arab Emirates" },
  { id: "6", code: "HND", name: "Haneda Airport", city: "Tokyo", country: "Japan" },
  { id: "7", code: "SIN", name: "Singapore Changi Airport", city: "Singapore", country: "Singapore" },
  { id: "8", code: "AMS", name: "Amsterdam Airport Schiphol", city: "Amsterdam", country: "Netherlands" },
  { id: "9", code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
  { id: "10", code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey" },
];

export const flightNumbers: string[] = [
  "BA123", "AF456", "LH789", "DL234", "EK567",
  "JL890", "SQ123", "KL456", "UA789", "TK012"
];

export const disruptionReasons: DisruptionReason[] = [
  { id: "1", name: "Bird strike", description: "Aircraft collision with birds" },
  { id: "2", name: "Technical problem", description: "Mechanical or electrical issues with the aircraft" },
  { id: "3", name: "Weather conditions", description: "Severe weather affecting flight operations" },
  { id: "4", name: "Air traffic control restrictions", description: "Limitations imposed by air traffic control" },
  { id: "5", name: "Crew shortage", description: "Insufficient crew members available for the flight" },
  { id: "6", name: "Security concerns", description: "Security-related issues affecting the flight" },
];

export const compensations: Compensation[] = [
  { id: "1", name: "Voucher", description: "Airline provided a voucher for future travel" },
  { id: "2", name: "Replacement flight", description: "Airline provided an alternative flight" },
  { id: "3", name: "Hotel accommodation", description: "Airline provided hotel accommodation" },
  { id: "4", name: "Meal vouchers", description: "Airline provided meal vouchers" },
  { id: "5", name: "Cash refund", description: "Airline provided a cash refund" },
  { id: "6", name: "None", description: "No compensation provided" },
];

export const statusLabels: Record<ClaimStatus, { label: string, color: string }> = {
  "RECEIVED": { label: "Received", color: "bg-blue-500" },
  "PROCESSING": { label: "Processing", color: "bg-yellow-500" },
  "APPROVED": { label: "Approved", color: "bg-green-500" },
  "REJECTED": { label: "Rejected", color: "bg-red-500" },
  "MORE_INFO_NEEDED": { label: "More Info Needed", color: "bg-purple-500" },
  "PAYOUT": { label: "Payout", color: "bg-emerald-500" },
  "DONE": { label: "Done", color: "bg-gray-500" }
};

export const stepLabels: Record<FormStep, string> = {
  "ITINERARY": "Itinerary",
  "FLIGHT_INFO": "Flight Information",
  "PERSONAL_INFO": "Personal Information",
  "CLAIM_DETAILS": "Claim Details",
  "STATUS": "Claim Status"
};
