package main

import (
	"encoding/json"
	"fmt"

	"buf.build/gen/go/chain4travel/camino-messenger-protocol/grpc/go/cmp/services/ping/v1/pingv1grpc"
	pingv1 "buf.build/gen/go/chain4travel/camino-messenger-protocol/protocolbuffers/go/cmp/services/ping/v1"
	"github.com/gofiber/fiber/v2"
	"google.golang.org/grpc"
)

type SubmitHandler struct {
	pingClient pingv1grpc.PingServiceClient
	grpcConn   *grpc.ClientConn
}

func NewSubmitHandler(grpcConn *grpc.ClientConn) *SubmitHandler {
	return &SubmitHandler{
		grpcConn:   grpcConn,
		pingClient: pingv1grpc.NewPingServiceClient(grpcConn),
	}
}

func (h *SubmitHandler) Submit(c *fiber.Ctx) error {

	req := Request{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	fmt.Println("Received request:", req)

	jsonData, err := json.Marshal(req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	_, err = h.pingClient.Ping(c.UserContext(), &pingv1.PingRequest{PingMessage: string(jsonData)})

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
	})
}
