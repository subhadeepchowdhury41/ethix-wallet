/* eslint-disable react-hooks/exhaustive-deps */
import Eth from '../assets/logo/eth.png';
import { useWallet } from '../Providers/WalletProvider';
import { useEffect, useState } from 'react';
import { useRPCBlockProvider } from '../Providers/RPCBlockProvider';
import { Alchemy, Network, AssetTransfersCategory } from 'alchemy-sdk';
import { Tooltip } from '@mui/material';
import AppBar from '../Components/AppBar';
import { useRPCUrlContext } from '../Providers/RPCUrlProvider';
import TransactionCard from '../Components/TransactionCard';
import GreetingsDialog from '../Components/GreetingsDialog';
import SendingDialog from '../Components/SendingDialog';
import ReceivingDialog from '../Components/ReceivingDialog';
import { ArrowDownward, Handshake, Send, Wallet } from '@mui/icons-material';

const Dashboard = () => {
  const getBalance = async () => {
    if (wallet === null) return;
    const bal = await rpcBlockProvider?.getBalance(wallet?.address);
    if (bal === undefined) return;
    setBalance((parseFloat((bal / BigInt(10000000000)).toString()) / 100000000)?.toString() ?? null);
  }
  const getTransactions = async () => {
    if (wallet === null) return;
    const alchemy = new Alchemy({
      apiKey: 'xANi2SQoJJT4silv8UuHC_CAbX6DL-cy',
      network: Network.ETH_SEPOLIA
    });
    const data = await alchemy.core.getAssetTransfers({
      fromBlock: '0x0',
      fromAddress: wallet?.address,
      category: [
        AssetTransfersCategory.EXTERNAL,
        AssetTransfersCategory.INTERNAL,
        AssetTransfersCategory.ERC721,
        AssetTransfersCategory.ERC1155,
        AssetTransfersCategory.ERC20,
        AssetTransfersCategory.SPECIALNFT
      ],
    });
    setTransactions(data.transfers);
  }
  const { network } = useRPCUrlContext();
  const { wallet } = useWallet();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [greetingsOpen, setGreetingsOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState<boolean>(false);
  const [sendOpen, setSendOpen] = useState(false);
  const { rpcBlockProvider } = useRPCBlockProvider();
  const [balance, setBalance] = useState<string | null>(null);
  useEffect(() => {
    getBalance();
    getTransactions();
  }, [rpcBlockProvider]);
  return (
    <div className={`flex flex-col gap-8 justify-center ${sendOpen ? '' : ''} items-center w-full`}>
      <AppBar />
      <GreetingsDialog network={network.name} open={greetingsOpen} onClose={() => setGreetingsOpen(false)} />
      <ReceivingDialog open={receiveOpen} onClose={() => setReceiveOpen(false)} />
      <SendingDialog open={sendOpen} network={network.name} onClose={() => setSendOpen(false)} />
      <div className='h-16' />
      <div className='mx-auto'>
        <Tooltip title='Click to copy' arrow>
          <div className='py-2 flex px-4 border-[0.01em] border-[#a5a0a0] rounded-3xl bg-slate-300
          cursor-pointer'
            onClick={() => {
              navigator.clipboard.writeText(wallet?.address ?? '');
            }}>
            <Wallet fontSize='medium' className='mr-3' />
            <div className=' w-44 overflow-hidden text-ellipsis '>
              {wallet?.address ?? 'No wallet Detected'}
            </div>
          </div>
        </Tooltip>
      </div>
      <div className='flex flex-col gap-4 items-center'>
        <div className='flex flex-col items-center gap-4 '>
          <div>
            <img src={Eth} alt="logo" className="h-14 w-14 ml-2" />
          </div>
          <div className='text-3xl font-bold overflow-hidden text-ellipsis'>
            {balance ?? 'Loading Balance...'} {balance !== null ? network.name + ' ETH' : null}
          </div>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <div className='flex flex-col transition-transform ease-[cubic-bezier(0.1,0.05,0.71)] hover:scale-105 justify-center items-center rounded-[50%] h-24 w-24 shadow-2xl font-medium hover:bg-blue-800 hover:cursor-pointer bg-blue-900'
            onClick={async () => {
              setSendOpen(true);
            }}
          >
            <Send sx={{color: 'white'}}/>
            <div className='text-white'>
              Send
            </div>
          </div>
          <div className='flex transition-transform ease-[cubic-bezier(0.1,0.05,0.71)] shadow-2xl flex-col hover:scale-105 justify-center items-center rounded-[50%] h-24 w-24 font-medium hover:bg-blue-800 hover:cursor-pointer bg-blue-900'
            onClick={() => setReceiveOpen(true)}
          >
            <ArrowDownward fontSize='large' sx={{color: 'white'}}/>
            <div className='text-white'>
              Receive
            </div>
          </div>
          <div className='flex transition-transform ease-[cubic-bezier(0.1,0.05,0.71)] shadow-2xl flex-col hover:scale-105 justify-center items-center rounded-[50%] h-24 w-24 font-medium hover:bg-blue-800 hover:cursor-pointer bg-blue-900'
            onClick={() => setGreetingsOpen(true)}
          >
            <Handshake fontSize='large' sx={{color: 'white'}}/>
            <div className='text-white' >
              Greet
            </div>
          </div>
        </div>
        <div className='w-full'>
          <div className='m-4 font-bold text-xl'>
            Transactions
          </div>
          {transactions.map((transaction, index) => (
            <div key={index}>
              <TransactionCard transaction={transaction} address={wallet?.address ?? ''} />
            </div>))}
        </div>
      </div>
      <div >

      </div>
    </div>
  )
}

export default Dashboard;


// begin blood attend trust slice raise clean acoustic tray play nothing decorate