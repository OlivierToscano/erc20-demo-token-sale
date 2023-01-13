import web3 from "./utils/web3";
import demoToken from "./contracts/demoToken.json";

const address = process.env.NEXT_PUBLIC_CONTRACT_DEMO_TOKEN_ADDRESS;

const instance = new web3.eth.Contract(
  demoToken.abi,
  address
);

export default instance;
