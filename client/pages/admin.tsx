import { useEffect, useState } from 'react';
import { Inter } from '@next/font/google';
import styles from '../styles/Index.module.css';

import web3 from '../ethereum/utils/web3'
import demoToken from '../ethereum/demoToken';
import demoTokenSale from '../ethereum/demoTokenSale';

const inter = Inter({ subsets: ['latin'] })

const Home = (props:any) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState({
    message: '',
    status: 'message'
  });
  const [addressBalance, setAddressBalance] = useState('');
  const [increaseAllowanceAddress, setIncreaseAllowanceAddress] = useState('');
  const [increaseAllowanceAmount, setIncreaseAllowanceAmount] = useState(0);
  const [addressBalanceValue, setAddressBalanceValue] = useState(0);
  const [currentAccount, setCurrentAccount] = useState('');

  const resetMessage = () => {
    setMessage({
      message: '',
      status: 'message'
    });
  }
  
  const getCurrentAccount = async () => {
    // get current account address
    const accounts = await web3.eth.getAccounts();
    setCurrentAccount(accounts[0]);
    return accounts[0];
  }

  // update connected address on change account on metamask
  useEffect(() => {
    getCurrentAccount()
  }, [currentAccount]);

  // Mint Token
  const handleMintButton = async (from: string) => {
    resetMessage();
    setMessage({message: `Mint ${amount} to ${address}`, status: 'message'});
    // demoToken.add
    try {
      // mint amount to address
      demoToken.methods
        .mint(address, web3.utils.toWei(web3.utils.toBN(amount), "ether"))
        .send({from: from})
        .then(
          (result: any) => {
            console.log(`Mint ${amount} to ${address}`);
            setMessage({message: `${address} just received ${amount} ATH Token`, status: 'success'});
          },
          ((error:any) => setMessage({message: error.message, status: 'error'}))
        );
    } catch (error:any) {
      setMessage({message: error.message, status: 'error'});
    }
  }

  // increase allowance
  const handleIncreaseAllowanceButton = async () => {
    resetMessage();
    try {
      await demoToken.methods
        .increaseAllowance(increaseAllowanceAddress, web3.utils.toWei(web3.utils.toBN(increaseAllowanceAmount), 'ether'))
        .send({from: currentAccount})
        .then(
          (increaseAllowanceResult:any) => console.log(increaseAllowanceResult),
          ((error:any) => setMessage({message: error.message, status: 'error'}))
        );
    } catch (error:any) {
      setMessage({message: error.message, status: 'error'});
    }
  }

  // Get address balance
  const handleGetAddressBalance = async () => {
    resetMessage();
    try {
      demoToken.methods.balanceOf(addressBalance).call()
        .then((balanceResult: number) => {
          const res = web3.utils.fromWei(web3.utils.toBN(balanceResult), 'ether');
          setAddressBalanceValue(parseFloat(res));
        },
        ((error:any) => setMessage({message: error.message, status: 'error'}))
        );
    } catch (error:any) {
      setMessage({message: error.message, status: 'error'});
    }
  }

  // render accounts
  const RenderAccounts = (props:any) => {
    if (props.accounts.length > 0) {
      return <div>
      <p>Total accounts: {props.accounts.length}</p>
      <table>
        <thead>
          <tr style={{border: '1px solid'}} key="header">
            <th>#</th>
            <th>Address</th>
            <th>ETH</th>
            <th>ATH</th>
          </tr>
        </thead>
        <tbody>
          {props.accounts.map((el: any, index:number) => 
          <tr key={index}>
            <td>{index}</td>
            <td>{el.addr}</td>
            <td className={styles.alignRight}>{web3.utils.fromWei(el.eth, 'ether')}</td>
            <td className={styles.alignRight}>{web3.utils.fromWei(el.ath, 'ether')}</td>
          </tr>
          )}
        </tbody>
      </table>
    </div>
    } else {
      return <></>
    }
  }

  // render message
  const RenderMessage = (props: { message: { status: string; message: string} }) => {
    return <p className={[styles.message, (props.message.status==='error' ? styles.error : styles.success)].join(' ')}>{props.message.message}</p>
  }

  return <div className={styles.main}>
    <h1>Token sale project - ADMIN</h1>

    <h2>Token data</h2>
    <p>Name: <strong>{props.tokenName} ({props.tokenSymbol})</strong></p>
    <p>Total supply: {web3.utils.fromWei(props.totalSupply, 'ether')}</p>
    <p>Token address: <strong>{props.tokenAddress}</strong></p>
    <p>TokenSale address: {props.tokenSaleAddress}</p>

    <h2>Address and balance</h2>
    <p>FROM: {currentAccount}</p>
    <RenderAccounts accounts={props.accountsBalances} />

    <h2>Mint Token</h2>
    <p>
      <label>Address</label>
      <input type="text" name="address" placeholder="0x..." onChange={(e) => setAddress(e.target.value)} />
    </p>
    <p>
      <label>Amount</label>
      <input type="number" name="amount" placeholder="0" onChange={(e) => setAmount(parseInt(e.target.value))} />
    </p>
    <p>
      <button onClick={() => handleMintButton(currentAccount)}>Mint</button>
    </p>

    <h2>Increare allowance</h2>
    <p>
      <label>Address</label>
      <input type="text" name="increaseAllowanceAddress" placeholder="0x..." onChange={(e) => setIncreaseAllowanceAddress(e.target.value)} />
    </p>
    <p>
      <label>Amount</label>
      <input type="number" name="increaseAllowanceAmount" placeholder="0" onChange={(e) => setIncreaseAllowanceAmount(parseInt(e.target.value))} />
    </p>
    <p>
      <button onClick={() => handleIncreaseAllowanceButton()}>Increase allowance</button>
    </p>

    <h2>Balance</h2>
    <p>
      <label>Consult ATH Balance of</label>
      <input type="text" name="balanceOfAddress" placeholder="0x..." onChange={(e) => setAddressBalance(e.target.value)} />
      <button onClick={() => handleGetAddressBalance()}>Check Balance</button>
    </p>
    <p>Balance of {addressBalance} is <strong>{addressBalanceValue} {props.symbol}</strong></p>

    <RenderMessage message={message} />
  </div>;
}

export async function getStaticProps() {
  const accounts: Array<string> = await web3.eth.getAccounts();
  const accountsBalances: { addr: string; eth: string; ath: any; }[] = [];

  if (accounts.length > 0) {
    if (process.env.PROVIDER === 'ganache') {
      accounts.forEach(async (account, i) => {
        accountsBalances[i] = {
          'addr': account,
          'eth': await web3.eth.getBalance(account),
          'ath': await demoToken.methods.balanceOf(account).call()
        };
      });
    }
  }

  const name: string = await demoToken.methods.name().call();
  const symbol: string = await demoToken.methods.symbol().call();
  const totalSupply: string = await demoToken.methods.totalSupply().call();

  return {
    props: {
      tokenAddress: demoToken.options.address,
      tokenSaleAddress: demoTokenSale.options.address,
      tokenName: name,
      tokenSymbol: symbol,
      totalSupply: totalSupply,
      accounts,
      accountsBalances
    }
  }
}

export default Home;