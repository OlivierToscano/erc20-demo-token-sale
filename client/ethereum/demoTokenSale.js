import web3 from "./utils/web3";
import demoTokenSale from "./contracts/demoTokenSale.json";

const address = process.env.NEXT_PUBLIC_CONTRACT_DEMO_TOKEN_SALE_ADDRESS;

const instance = new web3.eth.Contract(
  demoTokenSale.abi,
  address
);

export default instance;
