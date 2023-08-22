import { JsonRpcProvider, ethers } from "ethers";
import Greetings from '../contracts/Greetings.json';

export const sendEther = async ({ provider, sender, receiver, privateKey, amount }: {
  provider: JsonRpcProvider,
  sender: string,
  receiver: string,
  privateKey: string,
  amount: string
}) => {
  const wallet = new ethers.Wallet(privateKey, provider);
  return await wallet.sendTransaction({
    from: sender,
    to: receiver,
    value: ethers.parseEther(amount)
  });
}

// receive ether
export const receiveEther = async ({ privateKey, url, onReceive }: {
  privateKey: string,
  url: string,
  onReceive: (transaction: ethers.TransactionResponse) => void
}) => {
  const wsProvider = new ethers.WebSocketProvider(String(url).replace('https', 'wss').replace('io/', 'io/ws/'));
  const wallet = new ethers.Wallet(privateKey, wsProvider);
  const receipentAddress = wallet.address;

  return wsProvider.on('pending', async (tx) => {
    try {
      const transaction = await wsProvider.getTransaction(tx);
      if (transaction?.to === receipentAddress) {
        console.log('Transaction received');
        console.log(transaction);
        onReceive(transaction);
      }
    } catch (err) {
      console.error(err);
    }
  });
}

// call greetings contract
export const callGreetingContract = async ({ provider, privateKey }: {
  provider: JsonRpcProvider,
  privateKey: string
}) => {
  let contractAddress = '0x3C794F710375106240030A59ae374877f8Ff03DF';
  let contractABI: any = Greetings.abi;
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);
  const transaction = await contract.getGreeting();
  console.log(transaction);
  return transaction;
}

// write a function to verify if some rpc url is correct
export const verifyRPCUrl = (rpcUrl: string) => {
  const urlPattern = /^(https?):\/\/(?:[a-zA-Z0-9\\-]+\.)?(infura\.io|eth\.alchemy\.api)\/v3\/[a-fA-F0-9]+$/;
  
  if (urlPattern.test(rpcUrl)) {
    console.log('RPC URL is valid.');
    return true;
  } else {
    console.log('RPC URL is not valid.');
    return false;
  }
}