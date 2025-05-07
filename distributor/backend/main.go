package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
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

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
	}))

	app.Use(func(c *fiber.Ctx) error {
		c.SetUserContext(metadata.AppendToOutgoingContext(c.UserContext(), "recipient", "0x8ef21b1A5Df8a513030eEa9707b74bbdee1a7f43"))
		return c.Next()
	})

	app.Post("/submit", NewSubmitHandler(grpcConn).Submit)

	app.Listen(":3000")
}
