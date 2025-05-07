# Distributor
Here lives the distributor code which is contains a frontend from for a customer to put in the refund information. And a backend which connects the from to the Camino-Messager.

## Run camino messenger
`docker run -p 9090:9090 -v ./cmb-config/:/cmb-config camino-messenger-bot --config ./cmb-config/messenger-config.yaml`