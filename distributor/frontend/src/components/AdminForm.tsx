import React, { useEffect, useState } from "react";
import { isContractOwner } from "../util/getContractOwnership";
import { getAllRequests } from "../util/getAllRequests";
import { RequestStatus } from "../util/getRequestsForUser";
import { updateRequestStatus } from "../util/updateRequestStatus";

export const AdminForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [editedStatuses, setEditedStatuses] = useState<Record<number, number>>(
    {}
  );

  const loadRequests = async () => {
    try {
      const isOwnerValue = await isContractOwner();
      setIsOwner(isOwnerValue);

      if (isOwnerValue) {
        const fetchedRequests = await getAllRequests();
        setRequests(fetchedRequests);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (requestId: number, newStatus: number) => {
    setEditedStatuses((prev) => ({
      ...prev,
      [requestId]: newStatus,
    }));
  };

  const handleSave = async () => {
    try {
      await Promise.all(
        Object.keys(editedStatuses).map(async (requestId) => {
          const newStatus = editedStatuses[requestId];

          await updateRequestStatus(Number(requestId), newStatus);
        })
      );

      await loadRequests();
      setEditedStatuses({});
    } catch (err) {
      console.error("Error saving changes:", err);
      alert("Error saving changes: " + (err as Error).message);
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h2 className="text-xl font-bold text-navy-800 text-center mb-3">
          All Requests
        </h2>

        <div className="overflow-x-auto mb-4">
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
                  <td className="px-4 py-2 border-b">
                    <select
                      className="border rounded p-1"
                      value={
                        editedStatuses[Number(request.id)] ??
                        Number(request.status)
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          Number(request.id),
                          Number(e.target.value)
                        )
                      }
                    >
                      {Object.keys(RequestStatus)
                        .filter((key) => !isNaN(Number(key)))
                        .map((statusValue) => (
                          <option key={statusValue} value={statusValue}>
                            {RequestStatus[Number(statusValue)]}
                          </option>
                        ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {Object.keys(editedStatuses).length > 0 && (
          <div className="text-center">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
