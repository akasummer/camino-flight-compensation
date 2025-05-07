
export type Airport = {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
};

export type ItineraryAirport = {
  id: string;
  airport: Airport | null;
};

export type Flight = {
  id: string;
  departureAirport: Airport | null;
  arrivalAirport: Airport | null;
  transitAirports: Airport[];
  departureDate: Date | null;
  flightNumber: string;
};

export type Passenger = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type DisruptionReason = {
  id: string;
  name: string;
  description: string;
};

export type Compensation = {
  id: string;
  name: string;
  description: string;
};

export type UploadedFile = {
  id: string;
  name: string;
  url: string;
  type: string;
};

export type MessageType = "DOCUMENT_REQUEST" | "STATUS_UPDATE" | "GENERAL";

export type Message = {
  id: string;
  type: MessageType;
  content: string;
  date: Date;
  attachedDocument?: UploadedFile;
  requiresResponse: boolean;
};

export type Response = {
  id: string;
  messageId: string;
  content: string;
  date: Date;
  attachedDocument?: UploadedFile;
};

export type ClaimStatus = 
  | "RECEIVED"
  | "PROCESSING"
  | "APPROVED"
  | "REJECTED"
  | "MORE_INFO_NEEDED"
  | "PAYOUT"
  | "DONE";

export type Claim = {
  id: string;
  flights: Flight[];
  mainPassenger: Passenger;
  fellowPassengers: Passenger[];
  disruptionReason: DisruptionReason | null;
  compensation: Compensation | null;
  communicationDetails: string;
  ticketFile: UploadedFile | null;
  evidenceFiles: UploadedFile[];
  status: ClaimStatus;
  messages: Message[];
  responses: Response[];
};

export type FormData = {
  itinerary: ItineraryAirport[];
  flights: Flight[];
  hasConnectingFlights: boolean;
  mainPassenger: Passenger;
  fellowPassengers: Passenger[];
  disruptionReason: DisruptionReason | null;
  compensation: Compensation | null;
  communicationDetails: string;
  ticketFile: UploadedFile | null;
  evidenceFiles: UploadedFile[];
};

export type FormStep = "ITINERARY" | "FLIGHT_INFO" | "PERSONAL_INFO" | "CLAIM_DETAILS" | "STATUS";
