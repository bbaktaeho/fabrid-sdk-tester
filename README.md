# fabric-sdk-tester

### Prerequisites

- nodejs, npm
- `running Hyperledger Fabric network`
  - [prerequisites of fabric network](https://hyperledger-fabric.readthedocs.io/en/release-2.2/dev-setup/devenv.html?prerequisites#prerequisites)

#### dotenv (ex)

```
CCP_PATH=/Users/leo/Dev/repo/medium-fabric-test/mdl-debug/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json
MSP_ID=Org1MSP
ADMIN_ID=admin
ADMIN_SECRET=adminpw
CLIENT_ID=appUser
CERTIFICATE_AUTHORITIES=ca.org1.example.com
AFFILIATION=org1.department1
```

### Execute

```zsh
 npm run dev
```
