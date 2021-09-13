# fabric-sdk-tester

### Prerequisites

- nodejs, npm
- `running Hyperledger Fabric network`
  - [prerequisites of fabric network](https://hyperledger-fabric.readthedocs.io/en/release-2.2/dev-setup/devenv.html?prerequisites#prerequisites)

### dotenv (ex)

modify .env file according to your network environment.

```
CCP_PATH=<path to connection profile>
MSP_ID=Org1MSP
ADMIN_ID=admin
ADMIN_SECRET=adminpw
CLIENT_ID=appUser
CERTIFICATE_AUTHORITIES=ca.org1.example.com
AFFILIATION=org1.department1
CHANNEL=mychannel
CHAINCODE_NAME=<chaincode id>

# check the etc/hosts
AS_LOCALHOST=false

# ACCOUNT is for erc-20 token
ACCOUNT=9261cabB98BFA4C09C069ce6CbAbc5f2696922F5
```

- `AS_LOCALHOST` [docs](https://hyperledger.github.io/fabric-sdk-node/release-1.4/tutorial-discovery-fabric-network.html)

  > Convert discovered host addresses to be 'localhost'. Will be needed when running a docker composed fabric network on the local system; otherwise should be disabled

### Execute

1. install packages

    ```zsh
    npm install
    ```
2. run
    ```zsh
    npm run dev
    ```
