
import { 
  FormData, 
  Claim, 
  Message, 
  UploadedFile, 
  Response as ClaimResponse,
  ClaimStatus
} from "@/types";
import { disruptionReasons } from "@/data/mockData";

// Mock a file upload response
export const uploadFile = async (file: File): Promise<UploadedFile> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    name: file.name,
    url: URL.createObjectURL(file),
    type: file.type,
  };
};

// Submit the claim form
export const submitClaim = async (formData: FormData): Promise<Claim> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Generate a unique ID for the claim
  const claimId = Math.random().toString(36).substring(2, 9);
  
  // Create the initial claim with "RECEIVED" status
  const claim: Claim = {
    id: claimId,
    flights: formData.flights,
    mainPassenger: formData.mainPassenger,
    fellowPassengers: formData.fellowPassengers,
    disruptionReason: formData.disruptionReason,
    compensation: formData.compensation,
    communicationDetails: formData.communicationDetails,
    ticketFile: formData.ticketFile,
    evidenceFiles: formData.evidenceFiles,
    status: "RECEIVED",
    messages: [],
    responses: [],
  };
  
  return claim;
};

// Get the latest status of a claim
export const getClaimStatus = async (claimId: string): Promise<ClaimStatus> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // In a real app, this would fetch the status from the server
  // For this mock, we'll generate a random status
  const statuses: ClaimStatus[] = [
    "RECEIVED", "PROCESSING", "MORE_INFO_NEEDED", "APPROVED", "PAYOUT", "DONE"
  ];
  
  // For demo purposes, randomly select a status
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
};

// Simulate receiving messages for the claim
export const getClaimMessages = async (claimId: string): Promise<Message[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // In a real app, this would fetch messages from the server
  // For this mock, we'll generate some sample messages
  const now = new Date();
  
  const messages: Message[] = [
    {
      id: "msg1",
      type: "STATUS_UPDATE",
      content: "Your claim has been received and is now being processed.",
      date: new Date(now.getTime() - 86400000 * 2), // 2 days ago
      requiresResponse: false,
    },
    {
      id: "msg2",
      type: "DOCUMENT_REQUEST",
      content: "Please provide a copy of your boarding pass to help us process your claim faster.",
      date: new Date(now.getTime() - 86400000), // 1 day ago
      requiresResponse: true,
    },
    {
      id: "msg3",
      type: "GENERAL",
      content: "We're working with the airline to verify your flight details.",
      date: new Date(now.getTime() - 43200000), // 12 hours ago
      requiresResponse: false,
    },
  ];
  
  return messages;
};

// Submit a response to a message
export const submitResponse = async (
  claimId: string,
  messageId: string,
  content: string,
  file?: File
): Promise<ClaimResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Process the uploaded file if provided
  let uploadedFile: UploadedFile | undefined;
  if (file) {
    uploadedFile = await uploadFile(file);
  }
  
  // Create the response
  const response: ClaimResponse = {
    id: Math.random().toString(36).substring(2, 9),
    messageId,
    content,
    date: new Date(),
    attachedDocument: uploadedFile,
  };
  
  return response;
};

// Update the claim status (would be triggered by the server in a real app)
export const mockStatusUpdate = async (claimId: string): Promise<ClaimStatus> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 3000));
  
  // For demo purposes, return a "MORE_INFO_NEEDED" status to trigger the UI flow
  return "MORE_INFO_NEEDED";
};

// Simulate a message from the server requesting additional information
export const mockRequestAdditionalInfo = async (claimId: string): Promise<Message> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 4000));
  
  // Create a document request message
  const message: Message = {
    id: Math.random().toString(36).substring(2, 9),
    type: "DOCUMENT_REQUEST",
    content: "We need additional information about the reason for your flight disruption. Please upload any evidence you have regarding the " + 
             disruptionReasons[Math.floor(Math.random() * disruptionReasons.length)].name.toLowerCase() + ".",
    date: new Date(),
    requiresResponse: true,
  };
  
  return message;
};
