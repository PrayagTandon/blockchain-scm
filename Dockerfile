# Use Node.js 20 Alpine
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json .
COPY hardhat.config.js .

# Install ALL dependencies (including devDependencies)
RUN npm install --legacy-peer-deps --prefer-offline --include=dev && \
    npm cache clean --force

# Copy contracts and scripts
COPY contracts ./contracts
COPY scripts ./scripts

# Compile contracts
RUN npx hardhat compile

# Production stage (optional)
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 8545
CMD ["npx", "hardhat", "node"]