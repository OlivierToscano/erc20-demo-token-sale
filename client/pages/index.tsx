import { useEffect, useState } from 'react';
import { Inter } from '@next/font/google';
import Image from "next/image";
import styles from '../styles/Index.module.css';

import web3 from '../ethereum/utils/web3'
import demoToken from '../ethereum/demoToken';
import demoTokenSale from '../ethereum/demoTokenSale';

const inter = Inter({ subsets: ['latin'] })

const Home = (props:any) => {
  const [message, setMessage] = useState({
    message: '',
    status: 'message'
  });
  const [amountToBuy, setAmountToBuy] = useState(0);
  const [accountConnected, setAccountConnected] = useState('');
  const [accountBalance, setAccountBalance] = useState(0);
  const [processing, setProcessing] = useState(false);

  // token price
  const tokenPriceInWei = parseInt(process.env.NEXT_PUBLIC_TOKEN_PRICE_IN_WEI ?? '');

  // reset message function
  const resetMessage = () => {
    setMessage({
      message: '',
      status: 'message'
    });
  }

  // get account balance
  const getAccountBalance = async (account:string) => {
    try {
      demoToken.methods.balanceOf(account).call()
        .then((balanceResult: number) => {
          const res = web3.utils.fromWei(web3.utils.toBN(balanceResult), 'ether');
          setAccountBalance(parseFloat(res));
        },
        ((error:any) => setMessage({message: error.message, status: 'error'}))
      );
    } catch (error:any) {
      setMessage({message: error.message, status: 'error'});
    }
  }

  // gret current account
  const getCurrentAccount = async () => {
    // get current account address
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  }

  // listen TokenEmitted Event
  demoToken.events.TokenEmitted({to: accountConnected})
    .on("data", async (event:any) => {
      const account = await getCurrentAccount();
      getAccountBalance(account);
    });

  // update connected address on change account on metamask
  useEffect(() => {
    resetMessage();

    const events = ["chainChanged", "accountsChanged"];
    const handleChange = async () => {
      // get current account address
      const accounts = await web3.eth.getAccounts();
      setAccountConnected(accounts[0]);

      // get account balance
      getAccountBalance(accounts[0]);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [accountConnected]);

  // set initial connected address
  useEffect( () => {
    async  function fetchAccount() {
      resetMessage();

      // get current account
      const accounts = await web3.eth.getAccounts();
      setAccountConnected(accounts[0]);

      // get account balance
      getAccountBalance(accounts[0]);
    }
    fetchAccount();
  }, [accountConnected]);

  // BUY Token
  const handleBuyToken = async () => {
    resetMessage();
    // start processing
    setProcessing(true);
    try {
      const accounts = await web3.eth.getAccounts();
      const sender = accounts[0];

      // buy token
      demoTokenSale.methods
        .purchase()
        .send({from: sender, value: amountToBuy * tokenPriceInWei})
        .then(
          (result: any) => {
            console.log(`BUY ${amountToBuy} to ${sender}`);
            setMessage({message: `${sender} just bought ${amountToBuy} ATH Token`, status: 'success'});

            // get account balance
            getAccountBalance(sender);

            // stop processing
            setProcessing(false);
          },
          ((error:any) => {
            setMessage({message: error.message, status: 'error'})
            // stop processing
            setProcessing(false);
          })
        );
    } catch (error:any) {
      setMessage({message: error.message, status: 'error'});
      // stop processing
      setProcessing(false);
    }
  }

  // add token to metamask
  const handleAddToMetamaskButton = async () => {
    const tokenAddress = props.tokenAddress;
    const tokenSymbol = props.tokenSymbol;
    const tokenDecimals = props.tokenDecimals;
    const tokenImage = props.tokenImage;

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        setMessage({message: 'Token added to Metamask', status: 'success'});
      } else {
        console.log('Your loss!');
        setMessage({message: 'Error while added token to Metamask', status: 'error'});
      }
    } catch (error:any) {
      setMessage({message: error.message, status: 'error'});
    }
  }

  // render message
  const RenderMessage = (props: { message: { status: string; message: string} }) => {
    return <p className={[styles.message, (props.message.status==='error' ? styles.error : styles.success)].join(' ')}>{props.message.message}</p>
  }

  return <div className={styles.main}>
    <h1>{props.tokenName} ({props.tokenSymbol})</h1>

    <h2>Information</h2>
    <p>
      <button onClick={handleAddToMetamaskButton} className={styles.buttonWithImage}>
        <Image src="metamask-fox.svg" alt="Metamask fox" width="20" height="20" />
        Add to Metamask
      </button>
    </p>
    <p>Contract: <strong>{props.tokenAddress}</strong></p>
    <p>Total supply: <strong>{web3.utils.fromWei(props.totalSupply, 'ether')}</strong></p>

    <hr />
    <p>Current account: <strong>{accountConnected}</strong></p>
    <p>Account balance: <strong>{accountBalance} {props.tokenSymbol}</strong></p>

    <h2>Buy Tokens</h2>
    {processing
      ? <p>Buy <strong>{amountToBuy} {props.tokenSymbol}</strong> processing, please wait...</p>
      :  <p>
        <label>Amount</label>
        <input type="number" name="amountToBuy" min="0" step="1" placeholder="0" onChange={(e) => setAmountToBuy(parseInt(e.target.value))} />
        <button onClick={() => handleBuyToken()}>BUY</button>
        <span className={styles.explaination}>1 {props.tokenSymbol} = {web3.utils.fromWei(web3.utils.toBN(tokenPriceInWei), 'ether')} ETH</span>
      </p>}

    <RenderMessage message={message} />
  </div>;
}

export async function getStaticProps() {
  const name: string = await demoToken.methods.name().call();
  const symbol: string = await demoToken.methods.symbol().call();
  const totalSupply: string = await demoToken.methods.totalSupply().call();

  return {
    props: {
      tokenAddress: demoToken.options.address,
      tokenName: name,
      tokenSymbol: symbol,
      tokenImage: process.env.NEXT_PUBLIC_TOKEN_IMAGE,
      tokenDecimals: process.env.NEXT_PUBLIC_TOKEN_DECIMALS,
      totalSupply:  totalSupply
    }
  }
}

export default Home;