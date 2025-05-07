package main

import (
	"context"

	"buf.build/gen/go/chain4travel/camino-messenger-protocol/grpc/go/cmp/services/ping/v1/pingv1grpc"
	pingv1 "buf.build/gen/go/chain4travel/camino-messenger-protocol/protocolbuffers/go/cmp/services/ping/v1"
	"github.com/gofiber/fiber/v2"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
)

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	grpcConn, err := grpc.NewClient("distributor-bot:9090", grpc.WithTransportCredentials(insecure.NewCredentials()))

	if err != nil {
		panic(err)
	}

	defer grpcConn.Close()

	pingClient := pingv1grpc.NewPingServiceClient(grpcConn)

	ctx := context.Background()
	ctx = metadata.AppendToOutgoingContext(ctx, "recipient", "0x8ef21b1A5Df8a513030eEa9707b74bbdee1a7f43")

	app.Get("/ping", func(c *fiber.Ctx) error {
		response, err := pingClient.Ping(ctx, &pingv1.PingRequest{PingMessage: "Hello, World!"})

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		return c.SendString(response.GetPingMessage())
	})

	app.Listen(":3000")
}
