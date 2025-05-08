// Copyright (C) 2022-2025, Chain4Travel AG. All rights reserved.
// See the file LICENSE for licensing terms.

package main

import (
	"log"
	"os"

	"github.com/akasummer/camino-flight-compensation/supplier/partner-plugin/server"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Failed loading .env file")
	}

	if err := server.Run(); err != nil {
		os.Exit(1)
	}
}
