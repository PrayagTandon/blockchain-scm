## Steps to set up the project

### Installing in local machine

```
https://github.com/PrayagTandon/blockchain-scm
```

```
cd blockchain-scm
```

```
npm install
```

```
cd appfrontend
npm install
```

Create a Local Network in MetaMask:

```
Network Name: Hardhat Local

RPC URL: http://127.0.0.1:8545

Chain ID: 31337 (Hardhat’s default chain ID)

Currency Symbol: ETH
```

```
cd ..
npx hardhat node
```

#### In new terminal

```
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

#### In new terminal

```
cd appfrontend
npm start
```

#### Test the Application

- Connect MetaMask to the Hardhat Local network.
- Register as a User:
- Use the imported Hardhat account (e.g., first account as Producer, second as Distributor, third as Retailer).
- Create Batches (Producer) → Transfer to Distributor → Retailer.

### STEP 1: Setting up Docker nad Kubernetes

#### Dockerfile for root directory

```
# Use Node.js 20
FROM node:20-alpine

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./
COPY hardhat.config.js ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the code
COPY . .

# Compile contracts
RUN npx hardhat compile

# Expose the Hardhat node port
EXPOSE 8545

# Command to start the Hardhat node
CMD ["npx", "hardhat", "node"]
```

#### Dockerfile for appfrontend directory

```
# Build stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose yaml file for the root directory

```
version: "3.9"

services:
  hardhat-node:
    build: .
    ports:
      - "8545:8545"
    volumes:
      - ./artifacts:/app/artifacts
    environment:
      - NETWORK_ID=31337

  frontend:
    build: ./appfrontend
    ports:
      - "3000:80"
    depends_on:
      - hardhat-node
    environment:
      - REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Kubernetes Setup

In this step we will 3 YAML files.

#### hardhat-deployment.yaml

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hardhat-node
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hardhat-node
  template:
    metadata:
      labels:
        app: hardhat-node
    spec:
      containers:
      - name: hardhat-node
        image: your-docker-username/hardhat-app:latest
        ports:
        - containerPort: 8545
        volumeMounts:
        - name: contract-artifacts
          mountPath: /app/artifacts
      volumes:
      - name: contract-artifacts
        persistentVolumeClaim:
          claimName: contract-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: hardhat-node
spec:
  selector:
    app: hardhat-node
  ports:
    - protocol: TCP
      port: 8545
      targetPort: 8545
  type: NodePort
```

#### frontend-deployment.yaml

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-docker-username/frontend-app:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_CONTRACT_ADDRESS
          value: "0x5FbDB2315678afecb367f032d93F642f64180aa3"

---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

#### persistent-volume.yaml

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: contract-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

### Deployment to minikube

```
# Start Minikube
minikube start

# Build Docker images
docker build -t your-docker-username/hardhat-app:latest .
docker build -t your-docker-username/frontend-app:latest ./appfrontend

# Deploy Kubernetes manifests
kubectl apply -f kubernetes/persistent-volume.yaml
kubectl apply -f kubernetes/hardhat-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml

# To get the frontend URL
minikube service frontend --url
```

#### Verify the Setup

```
docker-compose up -d
```

```
kubectl get pods
```
