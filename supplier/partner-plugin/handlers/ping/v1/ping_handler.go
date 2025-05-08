// Copyright (C) 2022-2025, Chain4Travel AG. All rights reserved.
// See the file LICENSE for licensing terms.

package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"os"
	"strings"
	"time"

	"buf.build/gen/go/chain4travel/camino-messenger-protocol/grpc/go/cmp/services/ping/v1/pingv1grpc"
	pingv1 "buf.build/gen/go/chain4travel/camino-messenger-protocol/protocolbuffers/go/cmp/services/ping/v1"
	typesv1 "buf.build/gen/go/chain4travel/camino-messenger-protocol/protocolbuffers/go/cmp/types/v1"
	"github.com/akasummer/camino-flight-compensation/supplier/partner-plugin/events"
	"github.com/akasummer/camino-flight-compensation/supplier/partner-plugin/requests"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

var _ pingv1grpc.PingServiceServer = (*pingServiceV1Server)(nil)

type pingServiceV1Server struct {
	eventSender events.Sender
}

func NewPingServiceV1Server(eventSender events.Sender) pingv1grpc.PingServiceServer {
	return &pingServiceV1Server{eventSender: eventSender}
}

func (s *pingServiceV1Server) Ping(ctx context.Context, req *pingv1.PingRequest) (*pingv1.PingResponse, error) {
	if err := s.eventSender.SendProtoEvent(req); err != nil {
		log.Printf("error sending event: %v", err)
	}

	payload := requests.ClaimRequest{}
	err := json.Unmarshal([]byte(req.PingMessage), &payload)
	if err != nil {
		log.Printf("error unmarshalling payload: %v", err)
		return nil, fmt.Errorf("error unmarshalling payload: %w", err)
	}

	log.Printf("Received request: %s", req.PingMessage)

	submitRequest(&payload)

	return &pingv1.PingResponse{
		Header: &typesv1.ResponseHeader{
			Status: typesv1.StatusType_STATUS_TYPE_SUCCESS,
		},
		PingMessage: fmt.Sprintf("Ping response to [%s]", req.PingMessage),
	}, nil
}

const (
	contractABI = `[{"inputs":[{"internalType":"address","name":"requesterAddress","type":"address"},{"internalType":"tuple[]","name":"flights","type":"tuple[]","components":[{"internalType":"string","name":"flightNumber","type":"string"},{"internalType":"uint256","name":"departureDate","type":"uint256"}]}],"name":"submitRequest","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]`
)

// Flight struct to match Solidity Flight struct
type Flight struct {
	FlightNumber  string
	DepartureDate *big.Int
}

func submitRequest(request *requests.ClaimRequest) {
	// Connect to Ethereum client
	fmt.Println("COLUMBUS_URL", os.Getenv("COLUMBUS_URL"))
	client, err := ethclient.Dial(os.Getenv("COLUMBUS_URL"))
	if err != nil {
		log.Fatalf("Failed to connect to the Ethereum client: %v", err)
	}

	// Prepare the private key and the signer
	privateKey, err := crypto.HexToECDSA(os.Getenv("PRIVATE_KEY"))
	if err != nil {
		log.Fatalf("Failed to parse private key: %v", err)
	}

	// Get the account address associated with the private key
	fromAddress := crypto.PubkeyToAddress(privateKey.PublicKey)

	// Fetch nonce for the correct sender address
	nonce, err := client.PendingNonceAt(context.Background(), fromAddress)
	if err != nil {
		log.Fatalf("Failed to get nonce: %v", err)
	}

	// Parse the contract ABI
	parsedABI, err := abi.JSON(strings.NewReader(contractABI))
	if err != nil {
		log.Fatalf("Failed to parse contract ABI: %v", err)
	}

	// Prepare the tuple data for the ABI
	flights := make([]Flight, len(request.Flights))
	for i, flight := range request.Flights {
		parsedTime, err := time.Parse(time.RFC3339Nano, flight.DepartureDate)
		if err != nil {
			log.Fatalf("Error parsing date: %v", err)
		}

		timestamp := big.NewInt(parsedTime.Unix())
		flights[i] = Flight{
			FlightNumber:  flight.FlightNumber,
			DepartureDate: timestamp,
		}
	}

	// Prepare the input parameters
	requesterAddress := common.HexToAddress(request.WalletAddress)
	data, err := parsedABI.Pack("submitRequest", requesterAddress, flights)
	if err != nil {
		log.Fatalf("Failed to pack transaction data: %v", err)
	}

	// Set up gas and value
	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		log.Fatalf("Failed to suggest gas price: %v", err)
	}

	gasLimit := uint64(300000) // increased for tuple data
	value := big.NewInt(0)     // No ETH sent

	contractAddress := common.HexToAddress(os.Getenv("CONTRACT_ADDRESS"))

	// Create the transaction
	tx := types.NewTransaction(nonce, contractAddress, value, gasLimit, gasPrice, data)

	// ✅ FIX: get correct chain ID and use it when signing
	chainID, err := client.NetworkID(context.Background())
	if err != nil {
		log.Fatalf("Failed to get chain ID: %v", err)
	}

	signedTx, err := types.SignTx(tx, types.NewEIP155Signer(chainID), privateKey)
	if err != nil {
		log.Fatalf("Failed to sign the transaction: %v", err)
	}

	// Send the transaction
	err = client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		log.Fatalf("Failed to send the transaction: %v", err)
	}

	fmt.Printf("Transaction sent: %s\n", signedTx.Hash().Hex())
}
