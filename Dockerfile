# Use Node.js 20
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY hardhat.config.js ./

# Install dependencies
RUN npm install --legacy-peer-deps

# To copy the rest of the code
COPY . .

# Compile contracts
RUN npx hardhat compile

# Expose the Hardhat node port
EXPOSE 8545

# Command to start the Hardhat node
CMD ["npx", "hardhat", "node"]