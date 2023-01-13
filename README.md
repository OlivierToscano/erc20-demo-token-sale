# Web3 Token sale project

This project use truffle to compile and deploy smartcontract
Project client is built with nextJS 13

## Purpose

Objectif is to create an ERC20 Token who is mintable and build an interface where everyone can buy the token from a dedicated token sale smart contract as sushiswap.

Token contract's owner can increase the allowance of a dedicated token sale smart contract to allow a certan amount of token to be purchasable.

## Requirements

install  latest version of npm
> npm i -g npm

install node-gyp
> npm install -g node-gyp

install v18 of  node with nvm
> nvm install 18

install truffle
> npm install -g truffle

install ganache
> npm install -g ganache

## Smart contract

install npm packages
> npm install

deploy on local ganache  network
> truffle deploy --network ganache_local

### useful commands

```bash
truffle test
truffle compile
truffle deploy --network ganache_local
truffle migrate --network ganache_local
truffle console
```

### Verify a smartcontract

With Etherscan
truffle run verify SomeContractName AnotherContractName --network networkName [--debug] [--verifiers=etherscan,sourcify]

```bash
truffle run verify demoToken --network goerli --verifiers=etherscan
```

With Bscscan
truffle run verify demoToken@{contract-address} --network bsc_testnet

```bash
truffle run verify demoToken@0x... --network bsc_testnet
```

## client

Works with node v18 and above

Copy compiled contracts from root folder
> cp -R build/contracts client/ethereum/

Copy contracts addresses into `client/.env` file
```
NEXT_PUBLIC_CONTRACT_DEMO_TOKEN_ADDRESS="0x..."
NEXT_PUBLIC_CONTRACT_DEMO_TOKEN_SALE_ADDRESS="0x..."
````

install npm packages
> npm install

start dev
> npm run start

start prod
> npm run start:prod

Buy tokens page
http://localhost::3000

Admin functions
http://localhost::3000/admin
