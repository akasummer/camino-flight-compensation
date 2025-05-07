# Supplier
Here lives the supplier code which is a proxy for connection the Camino-Messanger bot with the supplier API. In our case this is Refundio.

## Run camino messenger
`docker run -v ./cmb-config/:/cmb-config camino-messenger-bot --config ./cmb-config/messenger-config.yaml`