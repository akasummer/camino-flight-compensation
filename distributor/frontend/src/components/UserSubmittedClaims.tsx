import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Flight {
  flightNumber: string;
  departureDate: bigint;
}

interface RequestData {
  id: string;
  requester: string;
  flights: Flight[];
  status: string;
}

interface UserRequestsListProps {
  requests: RequestData[];
}

const statusMap: { [key: number]: string } = {
  0: "Pending",
  1: "Approved",
  2: "Denied",
  3: "Need More Info",
  4: "Paid",
};

const UserRequestsList: React.FC<UserRequestsListProps> = ({ requests }) => {
  if (!requests || requests.length === 0) {
    return <div className="text-center py-8">No requests found.</div>;
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="p-4">
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <CardTitle className="text-lg">
              Request ID: {Number(request.id)}
            </CardTitle>
            <div className="text-sm text-gray-500">
              Status: {statusMap[Number(request.status)] || "Unknown"}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {request.flights.map((flight, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>Flight: {flight.flightNumber}</div>
                  <div>
                    {format(
                      new Date(Number(flight.departureDate) * 1000),
                      "PPP"
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserRequestsList;
