
import React, { useState } from "react";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { statusLabels } from "@/data/mockData";
import { submitResponse, uploadFile } from "@/api/mockApi";
import { toast } from "@/components/ui/sonner";
import { FileText, Upload, ArrowRight, Download, RefreshCcw, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const StatusScreen: React.FC = () => {
  const { 
    claim, 
    isLoading,
    addResponse,
    simulateStatusUpdate,
    simulateNewMessage
  } = useForm();

  const [responseContent, setResponseContent] = useState<string>("");
  const [responseFile, setResponseFile] = useState<File | null>(null);
  const [respondingToMessageId, setRespondingToMessageId] = useState<string | null>(null);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  if (!claim) {
    return (
      <div className="text-center py-8">
        <p>No claim data available. Please submit a claim first.</p>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setResponseFile(e.target.files[0]);
  };

  const handleSubmitResponse = async (messageId: string) => {
    if (!responseContent && !responseFile) {
      toast.error("Please provide a response or upload a file");
      return;
    }

    setIsSubmittingResponse(true);
    try {
      const response = await submitResponse(
        claim.id,
        messageId,
        responseContent,
        responseFile || undefined
      );
      
      addResponse(response);
      setResponseContent("");
      setResponseFile(null);
      setRespondingToMessageId(null);
      
      toast.success("Response submitted successfully");
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to submit response");
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Claim Status</h2>
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={simulateStatusUpdate}
            disabled={isLoading}
            className="flex items-center"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Update Status
          </Button>
          <Button
            size="sm"
            onClick={simulateNewMessage}
            disabled={isLoading}
            className="flex items-center"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Simulate Message
          </Button>
        </div>
      </div>
      
      {/* Status Badge */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center mb-2 sm:mb-0">
            <div 
              className={cn(
                "h-3 w-3 rounded-full mr-2",
                statusLabels[claim.status]?.color || "bg-gray-500"
              )}
            ></div>
            <span className="font-medium">Status:</span>
            <span className="ml-2">{statusLabels[claim.status]?.label || claim.status}</span>
          </div>
          <div className="text-sm text-gray-500">
            Claim ID: {claim.id}
          </div>
        </div>
      </div>
      
      {/* Itinerary Summary */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Itinerary</CardTitle>
        </CardHeader>
        
        <CardContent>
          {claim.flights.map((flight, index) => (
            <div key={flight.id} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-sm">Flight {index + 1}</p>
                <span className="text-sm text-gray-500">{flight.flightNumber}</span>
              </div>
              
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="font-bold">{flight.departureAirport?.code}</p>
                  <p className="text-xs text-gray-500">{flight.departureAirport?.city}</p>
                </div>
                
                <div className="flex-grow text-center px-2">
                  <ArrowRight className="inline-block h-4 w-4 text-gray-400" />
                  {flight.transitAirports.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      via {flight.transitAirports.map(airport => airport?.code).join(', ')}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-right">
                  <p className="font-bold">{flight.arrivalAirport?.code}</p>
                  <p className="text-xs text-gray-500">{flight.arrivalAirport?.city}</p>
                </div>
              </div>
              
              <div className="mt-1">
                <p className="text-sm text-gray-600">
                  {flight.departureDate && format(flight.departureDate, "PPP")}
                </p>
              </div>
            </div>
          ))}
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Main passenger: {claim.mainPassenger.firstName} {claim.mainPassenger.lastName}</p>
            {claim.fellowPassengers.length > 0 && (
              <p className="mt-1">
                Fellow passengers: {claim.fellowPassengers.length}
              </p>
            )}
            {claim.disruptionReason && (
              <p className="mt-1">
                Disruption reason: {claim.disruptionReason.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Messages and Responses */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Communication</h3>
        
        <div className="space-y-4">
          {claim.messages.length > 0 ? (
            claim.messages.map((message) => {
              // Find the response for this message
              const response = claim.responses.find(r => r.messageId === message.id);
              
              return (
                <div key={message.id} className="space-y-3">
                  {/* Message from airline */}
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-sm font-medium">
                          {message.type === "STATUS_UPDATE" 
                            ? "Status Update" 
                            : message.type === "DOCUMENT_REQUEST" 
                              ? "Document Request" 
                              : "Message"}
                        </CardTitle>
                        <CardDescription>
                          {format(new Date(message.date), "PPp")}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm">{message.content}</p>
                      
                      {message.attachedDocument && (
                        <div 
                          className="mt-3 flex items-center p-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => downloadFile(message.attachedDocument!.url, message.attachedDocument!.name)}
                        >
                          <FileText className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm truncate">{message.attachedDocument.name}</span>
                          <Download className="h-4 w-4 text-gray-500 ml-auto" />
                        </div>
                      )}
                      
                      {message.requiresResponse && !response && (
                        <div className="mt-3">
                          {respondingToMessageId === message.id ? (
                            <div className="space-y-3 mt-3 p-3 bg-gray-50 rounded-lg">
                              <Textarea
                                placeholder="Type your response..."
                                value={responseContent}
                                onChange={(e) => setResponseContent(e.target.value)}
                                className="resize-none"
                              />
                              
                              <div className="flex flex-col sm:flex-row gap-3">
                                <label className="flex-1 flex items-center justify-center py-2 px-4 bg-white rounded border border-gray-300 cursor-pointer hover:bg-gray-50">
                                  <Upload className="h-4 w-4 mr-2 text-gray-500" />
                                  <span className="text-sm">
                                    {responseFile ? responseFile.name : "Upload File"}
                                  </span>
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                  />
                                </label>
                                
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                      setRespondingToMessageId(null);
                                      setResponseContent("");
                                      setResponseFile(null);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleSubmitResponse(message.id)}
                                    disabled={isSubmittingResponse}
                                  >
                                    {isSubmittingResponse ? "Submitting..." : "Submit"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setRespondingToMessageId(message.id)}
                            >
                              Reply
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Response from user */}
                  {response && (
                    <Card className="border-l-4 border-l-green-500 ml-6">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-sm font-medium">Your Response</CardTitle>
                          <CardDescription>
                            {format(new Date(response.date), "PPp")}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-sm">{response.content}</p>
                        
                        {response.attachedDocument && (
                          <div 
                            className="mt-3 flex items-center p-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => downloadFile(response.attachedDocument!.url, response.attachedDocument!.name)}
                          >
                            <FileText className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm truncate">{response.attachedDocument.name}</span>
                            <Download className="h-4 w-4 text-gray-500 ml-auto" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg border">
              <p className="text-gray-500">No messages yet. We'll contact you here if we need more information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusScreen;
