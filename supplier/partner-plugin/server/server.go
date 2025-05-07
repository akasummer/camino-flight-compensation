// Copyright (C) 2022-2025, Chain4Travel AG. All rights reserved.
// See the file LICENSE for licensing terms.

package server

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"strconv"
	"syscall"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"buf.build/gen/go/chain4travel/camino-messenger-protocol/grpc/go/cmp/services/ping/v1/pingv1grpc"

	"github.com/akasummer/camino-flight-compensation/supplier/partner-plugin/config"
	"github.com/akasummer/camino-flight-compensation/supplier/partner-plugin/events"
	handlers_ping_v1 "github.com/akasummer/camino-flight-compensation/supplier/partner-plugin/handlers/ping/v1"
	events_pb "github.com/akasummer/camino-flight-compensation/supplier/partner-plugin/proto/pb/events"
)

const (
	EnvKeyEventsEnabled = "CMB_PARTNER_PLUGIN_MOCK_EVENTS"
	EnvKeyPort          = "CMB_PARTNER_PLUGIN_MOCK_PORT"
	EnvE2ETestMode      = "CMB_PARTNER_PLUGIN_MOCK_TEST_MODE"
	DefaultPort         = 50051
)

func Run() error {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	config.SetDefaults()

	grpcServer := grpc.NewServer()

	eventSender := events.NewDummySender()
	if os.Getenv(EnvKeyEventsEnabled) == "true" {
		var eventServer events.Server
		eventServer, eventSender = events.NewServer()
		eventServer.Start(ctx)
		events_pb.RegisterMyEventsServiceServer(grpcServer, eventServer)
	}

	// Ping
	pingv1grpc.RegisterPingServiceServer(grpcServer, handlers_ping_v1.NewPingServiceV1Server(eventSender))

	reflection.Register(grpcServer)

	port := DefaultPort
	var err error
	p, found := os.LookupEnv(EnvKeyPort)
	if found {
		port, err = strconv.Atoi(p)
		if err != nil {
			log.Printf("failed to parse port: %v", err)
			return err
		}
	}

	if os.Getenv(EnvE2ETestMode) == "true" {
		config.SetE2EDefaults()
	}

	log.SetOutput(os.Stdout)
	log.Printf("Starting server on port: %d", port)
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Printf("failed to listen: %v", err)
		return err
	}

	go func() {
		<-ctx.Done()
		log.Printf("Shutting down server")
		grpcServer.Stop()
	}()

	if err := grpcServer.Serve(lis); err != nil {
		log.Printf("grpc server stopped serving: %v", err)
	}

	return nil
}
