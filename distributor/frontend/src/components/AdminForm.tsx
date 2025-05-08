import React, { useEffect, useState } from 'react';
import { isContractOwner } from '../util/getContractOwnership';
import { getAllRequests } from '../util/getAllRequests';
import { RequestStatus } from '../util/getRequestsForUser';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from './ui/input';
import { payRequest } from '../util/payOutRequest';
import { updateRequestStatus } from '../util/updateRequestStatus';

export const AdminForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const isOwnerValue = await isContractOwner();
      setIsOwner(isOwnerValue);

      if (isOwnerValue) {
        const fetchedRequests = await getAllRequests();
        setRequests(fetchedRequests);
      }
    } catch (error) {
      console.log('Error loading requests:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadRequests();
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-navy-800 text-center">
          An error occurred while loading requests. Please try again later.
        </h1>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-navy-800 text-center">
          You are not the contract owner
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h2 className="text-xl font-bold text-navy-800 text-center mb-3">
          All Requests
        </h2>

        <Accordion type="single" collapsible>
          {requests.map((request) => (
            <RequestItem
              key={request.id}
              request={request}
              onStatusChange={() => loadRequests()}
              setIsLoading={setIsLoading}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
};

const RequestItem: React.FC<any> = ({ request, onStatusChange }) => {
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const payOut = async (requestId: number) => {
    try {
      setIsLoading(true);
      await payRequest(requestId, paymentAmount);
      onStatusChange();
    } catch (error) {
      console.error('Error during payout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeRequestStatus = async (
    requestId: number,
    newStatus: RequestStatus,
  ) => {
    try {
      setIsLoading(true);
      await updateRequestStatus(Number(requestId), newStatus);
    } catch (error) {
      console.error('Error updating request status:', error);
    } finally {
      setIsLoading(false);
    }

    onStatusChange();
  };

  return (
    <AccordionItem key={request.id} value={`request-${request.id}`}>
      <AccordionTrigger>
        Request ID: {Number(request.id)} -{' '}
        {RequestStatus[request.status] || 'Unknown'}
      </AccordionTrigger>

      <AccordionContent>
        <div className="p-4 bg-gray-100 rounded-md">
          <p>
            <strong>Requester:</strong> {request.requester}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            {RequestStatus[request.status] || 'Unknown'}
          </p>
          <p>
            <strong>Details:</strong> {/* Add more details here if available */}
          </p>
          {isLoading ? (
            <div className="flex items-center gap-2 mt-2 w-full">
              <svg
                className="animate-spin h-6 w-6 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span className="text-primary font-medium">Processing...</span>
            </div>
          ) : (
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  changeRequestStatus(request.id, RequestStatus.Approved)
                }
              >
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  changeRequestStatus(request.id, RequestStatus.Denied)
                }
              >
                Deny
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  changeRequestStatus(request.id, RequestStatus.NeedMoreInfo)
                }
              >
                Request More Info
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  changeRequestStatus(request.id, RequestStatus.Pending)
                }
              >
                Pending
              </Button>

              <Input
                type="number"
                placeholder="Enter amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                className="w-32"
              />
              <Button variant="outline" onClick={() => payOut(request.id)}>
                Pay Out
              </Button>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
