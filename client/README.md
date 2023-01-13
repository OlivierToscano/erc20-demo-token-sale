# Token sale smart contract project

## Requirements

Node, NPM, Ganache and Truffle should be installed
node v18.x

### install Truffle & Ganache CLI

```shell
npm -g install truffle
npm -g install ganache
```

## How to start

Install node modules
> npm install

create your .env files

```shell
cp .env.sample .env
cp client/.env.sample /client/.env
````

Start Ganache CLI
> ganache -i 5777

Note ganache accounts and private key in a text file.

Copy Mnemonic provided by Ganache into your `.env` file MNEMONIC="..."

Compile contracts

```shell
truffle compile
truffle test
```

Deploy contracts on Ganache

```shell
truffle migrate --network ganache
```

Contracts should be deployed, you should see something like

```shell
Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


Starting migrations...
======================
> Network name:    'ganache'
> Network id:      5777
> Block gas limit: 30000000 (0x1c9c380)


2_deploy_contracts.js
=====================

   Deploying 'demoToken'
   ---------------------
   > transaction hash:    0x3f91cce305e8232a36cf5419db4333da9cf9042b49d5d2eab9b1debfbbc092d7
   > Blocks: 0            Seconds: 0
   > contract address:    0xB0dfc57492DaE2Feb605Ee9DdA6Fc5fbE2c6BAE3
   > block number:        1
   > block timestamp:     1673621679
   > account:             0x9189679b49A764437fEF4dd8C0a76CB9F15C23F6
   > balance:             999.992300869
   > gas used:            2281224 (0x22cf08)
   > gas price:           3.375 gwei
   > value sent:          0 ETH
   > total cost:          0.007699131 ETH


   Deploying 'demoTokenSale'
   -------------------------
   > transaction hash:    0xc03a4250ba9022ffa15affdc800db465994cddb7eefe218467266cfed10eeced
   > Blocks: 0            Seconds: 0
   > contract address:    0x0553FC3cb35d74e8ACe7e4E59813E663d1AB44dE
   > block number:        2
   > block timestamp:     1673621679
   > account:             0x9189679b49A764437fEF4dd8C0a76CB9F15C23F6
   > balance:             999.9903841873362284
   > gas used:            583952 (0x8e910)
   > gas price:           3.282258925 gwei
   > value sent:          0 ETH
   > total cost:          0.0019166816637716 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:     0.0096158126637716 ETH

Summary
=======
> Total deployments:   2
> Final cost:          0.0096158126637716 ETH
```

Replace contracts addresses into `client/.env` file

```shell
NEXT_PUBLIC_CONTRACT_ATHOME_TOKEN_ADDRESS="0xB0dfc57492DaE2Feb605Ee9DdA6Fc5fbE2c6BAE3"
NEXT_PUBLIC_CONTRACT_ATHOME_TOKEN_SALE_ADDRESS="0x0553FC3cb35d74e8ACe7e4E59813E663d1AB44dE"
```

Copy contracts on frontend client

```shell
cp build/contracts/*.json client/ethereum/contracts/
```

Start client project in dev environment

```shell
cd client
npm install
npm run start
```

Token sale page
http://localhost:3000

Admin page
http://localhost:3000/admin

Enjoy!

# Wallet - Metamask

Install Metamask for your browser
https://metamask.io/download/

Transfer ETH from Ganache to you main Metamask account on localhost (ganache) network
1. Add localhost network for Metamask
2. Transfer token with truffle console

open a terminal and start a trufle console

```shell
truffle consoe --network ganache
```

list accounts

```shell
web3.eth.getAccounts()
```

The idea is to test/play with the smart contract with our metamask main account (Account 1).
The contract has been deployed with the first account of Ganache, so the first ganache account is the Owner of the contract, and we will promote the demoTokenSale contract to sell our token.

1. Transfer 10 ETH to metamask main account

```shell
web3.eth.sendTransaction({from: "0xA7C919fB3E802B0B67870165Bb34C1EA90D36D3B", to: "0xad45544F725f94bC81A5FAe2eC03FB22c84Ebdf3", value: web3.utils.toWei("10", "ether")})
```

2. Promote demoTokenSale contract to sell token

You should be connected with the demoToken Owner account to peprform admin operation
So before doing that, import the first Ganache account into Metamask with the secret key provided by Ganache

Then, visit: http://localhost:3000/admin and give allowance of 10000 tokens for the demoTokenSale contract address. NB: you should be connected with the main Ganache account on metamask
for example: 0x0553FC3cb35d74e8ACe7e4E59813E663d1AB44dE

3. Finaly, Buy Tokens !

visit: http://localhost:3000 then buy tokens :)

## comon errors

> TypeError: Cannot set property Request of #<Object> which has only a getter

use node version v18.12.1 or above
