# Camino Flight Compensation

A decentralized flight compensation system built on the Camino blockchain, featuring smart contract integration and automated bot communication for seamless processing.

---

## Requirements

Before setting up the system, ensure the following prerequisites are met:

- A **KYC-verified wallet** with an active Camino (CM) Account.
- A **dedicated wallet** for the messenger bot (does not to be KYC-verified).
- **Docker** installed on your machine to run the system in containers.

---

## Environment Configuration

Create a `.env` file in your root directory and define the following variables:

| Variable                 | Description                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `VITE_BACKEND_BASE_PATH` | Backend API endpoint used by the frontend                                                   |
| `VITE_CONTRACT_ADDRESS`  | Address of the deployed smart contract                                                      |
| `COLUMBUS_URL`           | URL of the Columbus Camino network                                                          |
| `PRIVATE_KEY`            | Private key used to deploy and manage the smart contract                                    |
| `CONTRACT_ADDRESS`       | Smart contract address used by the partner plugin (set it after deployment of the contract) |

---

## Messenger Bot Setup

Duplicate and configure the messenger bot settings:

1. Copy the example configuration files:

   ```
   distributor/cmb-config/messenger-config.example.yaml → distributor/cmb-config/messenger-config.yaml
   supplier/cmb-config/messenger-config.example.yaml → supplier/cmb-config/messenger-config.yaml
   ```

2. Replace placeholders in the YAML files:
   - `DISTRIBUTER_BOT_KEY`: Private key of the KYC-verified bot wallet
   - `DISTRIBUTER_CM_ACCOUNT_ADDRESS`: CM Account address associated with the bot wallet
   - `SUPPLIER_BOT_KEY`: Private key of the supplier bot wallet (KYC not required)
   - `SUPPLIER_CM_ACCOUNT_ADDRESS`: CM Account address of the supplier (e.g., "Refundio Hackathon" on Columbus network)

---

## Smart Contract Deployment

To build and deploy the smart contract:

```bash
cd supplier/smart-contract
npm install
npm run compile
npm run deploy
```

After successful deployment, update the `.env` file with the contract address.

---

## Running the System

To start the full system (frontend, backend, bots), use Docker:

```bash
docker compose up --build
```

Once running, the frontend will be available at:  
**http://localhost:8080**
