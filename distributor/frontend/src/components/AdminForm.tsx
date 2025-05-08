import React, { useEffect } from 'react';
import { isContractOwner } from '../util/getContractOwnership';
import { getAllRequests } from '../util/getAllRequests';
import { RequestStatus } from '../util/getRequestsForUser';

export const AdminForm: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isOwner, setIsOwner] = React.useState(false);
  const [requests, setRequests] = React.useState([]);

  const loadRequests = async () => {
    try {
      const isOwnerValue = await isContractOwner();

      setIsOwner(isOwnerValue);

      if (isOwnerValue) {
        const requests = await getAllRequests();
        setRequests(requests);
      }
    } catch (error) {
    //   setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-navy-800 text-center">
          Error: {error.message}
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
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h2 className="text-xl font-bold text-navy-800 text-center mb-3">
          All Requests
        </h2>

        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr>
                    <th className="px-4 py-2 border-b">Request ID</th>
                    <th className="px-4 py-2 border-b">Requester</th>
                    <th className="px-4 py-2 border-b">Status</th>
                </tr>
                </thead>

                <tbody>
                {requests.map((request) => (
                    <tr key={request.id}>
                    <td className="px-4 py-2 border-b">{Number(request.id)}</td>
                    <td className="px-4 py-2 border-b">{request.requester}</td>
                    <td className="px-4 py-2 border-b">{RequestStatus[request.status] || 'Unknown'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
