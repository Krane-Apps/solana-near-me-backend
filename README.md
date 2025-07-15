# Solana Near Me Backend

## Solana Near Me

Solana Near Me is the first Seeker mobile app that helps you find Solana merchants and ATMs near you. Built 100% for the Solana ecosystem, with Solana Pay, Seeker Wallets, Proof-of-Location, Token rewards and NFTs all integrated. It's an On-Chain Local Commerce; now possible on Solana Seeker Devices.

## API Endpoints

### Main Endpoints
- `POST /increment-transaction` - Increment transaction count for user and merchant with transaction verification
- `POST /mint-nft` - Mint exclusive NFT badges for eligible merchants based on their transaction volume

### Web3 Endpoints
- `GET /web3/latest-block` - Get latest block information from the Solana blockchain
- `GET /web3/latest-blockhash` - Get latest blockhash for transaction processing

## NFT Rewards
Merchants can earn exclusive NFT badges:

| **Verified Merchants** | **OG Merchants** |
|------------------------|------------------|
| <img src="assets/verified-merchant.png" alt="Verified Merchant Badge" width="150"> | <img src="assets/og-merchant.png" alt="OG Merchant Badge" width="150"> |
| Legitimate businesses with confirmed locations | Legendary status merchants with high transactions and volume |

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Krane-Apps/solana-near-me-backend.git
   cd solana-near-me-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your configuration:
   ```bash
   # Copy from .env.example if available
   cp .env.example .env
   ```

4. **Run the application**
   ```bash
   # Development mode with hot reload
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```

5. **Access the API**
   - Server runs on `http://localhost:3000`
   - API documentation available at `http://localhost:3000/api` (if Swagger is configured)

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Technology Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Blockchain**: Solana
- **Database**: Firebase
- **Documentation**: Swagger/OpenAPI

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
