// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RequestProcessing
 * @dev Contract for managing requests with approval and payout functionality
 */
contract RequestProcessing is Ownable {
    using Counters for Counters.Counter;
    
    // Request status enum
    enum RequestStatus { Pending, Approved, Denied, NeedMoreInfo, Paid }
    
    // Flight structure
    struct Flight {
        string flightNumber;
        uint256 departureDate;
    }

    // Request structure
    struct Request {
        uint256 id;
        address requester;
        Flight[] flights;
        RequestStatus status;
    }
    
    // Counter for request IDs
    Counters.Counter private _requestIdCounter;
    
    // Mapping from request ID to Request
    mapping(uint256 => Request) private _requests;
    
    // Mapping from address to their request IDs
    mapping(address => uint256[]) private _userRequests;
    
    // Events
    event RequestSubmitted(uint256 indexed requestId, address indexed requester);
    event RequestStatusChanged(uint256 indexed requestId, RequestStatus status);
    event AdditionalInfoRequested(uint256 indexed requestId);
    event RequestPaid(uint256 indexed requestId, address indexed requester, uint256 amount);
    
    /**
     * @dev Constructor
     */
    constructor() Ownable() {}
    
    /**
     * @dev Submit a new request
     * @param requesterAddress The address of the requester
     * @param flights Array of Flight structures
     * @return id The ID of the newly created request
     */
    function submitRequest(address requesterAddress, Flight[] calldata flights) external returns (uint256) {
        _requestIdCounter.increment();
        uint256 newRequestId = _requestIdCounter.current();
        
        Request storage newRequest = _requests[newRequestId];

        newRequest.id = newRequestId;
        newRequest.requester = requesterAddress;
        newRequest.status = RequestStatus.Pending;
            
        // Copy each flight from calldata to storage manually
        for (uint256 i = 0; i < flights.length; i++) {
            newRequest.flights.push(flights[i]);
        }

        _userRequests[requesterAddress].push(newRequestId);

        emit RequestSubmitted(newRequestId, requesterAddress);

        return newRequestId;
    }
    
    /**
     * @dev Confirm additional information has been provided for a request
     * @param requestId The ID of the request
     */
    function confirmInfoProvided(uint256 requestId) external onlyOwner {
        Request storage request = _requests[requestId];

        require(request.id == requestId, "Request does not exist");
        require(request.status == RequestStatus.NeedMoreInfo, "Additional info not requested");
        
        request.status = RequestStatus.Pending;
        
        emit RequestStatusChanged(requestId, RequestStatus.Pending);
    }
    
    /**
     * @dev Approve a request (admin only)
     * @param requestId The ID of the request
     */
    function approveRequest(uint256 requestId) external onlyOwner {
        Request storage request = _requests[requestId];

        require(request.id == requestId, "Request does not exist");
        require(request.status == RequestStatus.Pending, "Request is not pending");
        
        request.status = RequestStatus.Approved;
        
        emit RequestStatusChanged(requestId, RequestStatus.Approved);
    }
    
    /**
     * @dev Deny a request (admin only)
     * @param requestId The ID of the request
     */
    function denyRequest(uint256 requestId) external onlyOwner {
        Request storage request = _requests[requestId];

        require(request.id == requestId, "Request does not exist");
        require(request.status != RequestStatus.Paid, "Request already paid");
        
        request.status = RequestStatus.Denied;
        
        emit RequestStatusChanged(requestId, RequestStatus.Denied);
    }
    
    /**
     * @dev Request more information (admin only)
     * @param requestId The ID of the request
     */
    function requestMoreInfo(uint256 requestId) external onlyOwner {
        Request storage request = _requests[requestId];

        require(request.id == requestId, "Request does not exist");
        require(request.status != RequestStatus.Paid, "Request already paid");
        
        request.status = RequestStatus.NeedMoreInfo;
        
        emit AdditionalInfoRequested(requestId);
        emit RequestStatusChanged(requestId, RequestStatus.NeedMoreInfo);
    }
    
    /**
     * @dev Pay an approved request (admin only)
     * @param requestId The ID of the request
     * @param token The ERC20 token address to pay with
     * @param amount The amount to pay
     */
    function payRequest(uint256 requestId, address token, uint256 amount) external onlyOwner {
        Request storage request = _requests[requestId];

        require(request.id == requestId, "Request does not exist");
        require(request.status == RequestStatus.Approved, "Request is not approved");
        require(request.status != RequestStatus.Paid, "Request already paid");
        
        IERC20 erc20Token = IERC20(token);
        
        // Check if contract has enough allowance
        require(erc20Token.allowance(msg.sender, address(this)) > amount, "Insufficient allowance");
        
        // Transfer tokens from admin to requester
        require(erc20Token.transferFrom(msg.sender, request.requester, amount), "Token transfer failed");
        
        request.status = RequestStatus.Paid;
        
        emit RequestPaid(requestId, request.requester, amount);
        emit RequestStatusChanged(requestId, RequestStatus.Paid);
    }
    
    function getRequest(uint256 requestId) external view returns (
        uint256 id,
        address requester,
        Flight[] memory flights,
        RequestStatus status
    ) {
        Request storage request = _requests[requestId];

        require(request.id == requestId, "Request does not exist");
        
        // Manually copy storage array to memory
        Flight[] memory flightCopies = new Flight[](request.flights.length);

        for (uint256 i = 0; i < request.flights.length; i++) {
            flightCopies[i] = request.flights[i];
        }

        return (
            request.id,
            request.requester,
            flightCopies,
            request.status
        );
    }
    
    /**
     * @dev Get all request IDs for a user
     * @param user The user address
     * @return Array of request IDs
     */
    function getUserRequests(address user) external view returns (uint256[] memory) {
        return _userRequests[user];
    }
    
    /**
     * @dev Get the total number of requests created
     * @return The total number of requests
     */
    function getTotalRequests() external view returns (uint256) {
        return _requestIdCounter.current();
    }
}