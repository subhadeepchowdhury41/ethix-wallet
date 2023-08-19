/* eslint-disable react-hooks/exhaustive-deps */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Eth from '../assets/logo/eth.png';
import { icon, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useWallet } from '../Providers/WalletProvider';
import { useEffect, useState } from 'react';
import { useRPCBlockProvider } from '../Providers/RPCBlockProvider';
import { Alchemy, Network, AssetTransfersCategory } from 'alchemy-sdk';
import { sendEther } from '../Services/EthServices';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField } from '@mui/material';
import { Wallet } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import AppBar from '../Components/AppBar';
import { useRPCUrlContext } from '../Providers/RPCUrlProvider';

interface TxDetailsType {
  type: 'send' | 'receive',
  amount: number | null,
  from: string,
  to: string,
  status: string
};

const Dashboard = () => {
  const [sendOpen, setSendOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [sending, setSending] = useState(false);
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
  const [txDetails, setTxDetails] = useState<TxDetailsType>({
    type: 'send',
    from: '',
    to: '',
    amount: 0,
    status: 'notstarted'
  });
  const { network } = useRPCUrlContext();
  const { wallet } = useWallet();
  const [transactions, setTransactions] = useState<any[]>([]);
  const { rpcBlockProvider } = useRPCBlockProvider();
  const [balance, setBalance] = useState<string | null>(null);
  useEffect(() => {
    let interval: NodeJS.Timer | null = null;
    if (interval === null) {
      interval = setInterval(() => {
        getBalance();
        getTransactions();
      }, 5000);
    }
    return () => clearInterval(interval!);
  }, []);
  return (
    <div className={`flex flex-col gap-8 justify-center ${sendOpen ? '' : ''} items-center w-full`}>
      <AppBar />
      <Dialog fullScreen open={receiveOpen} onClose={() => setReceiveOpen(false)}>

      </Dialog>
      <Dialog fullScreen open={sendOpen} onClose={() => setSendOpen(false)}>
        <DialogTitle sx={{
          fontSize: '23px',
          margin: '0 1rem',
          fontWeight: 'bold'
        }}>
          Send Ether to wallet
        </DialogTitle>
        <DialogContent >
          <div className='m-4'>
            <TextField onChange={(event) => {
              setTxDetails(prev => ({
                ...prev,
                amount: parseFloat(event.target.value)
              }));
            }} fullWidth variant='filled' InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <FontAwesomeIcon fontSize={20} icon={solid('money-bill')} />
                </InputAdornment>),
              endAdornment: 'ETH'
            }} label='Amount' />
          </div>
          <div className='m-4'>
            <TextField onChange={(event) => {
              setTxDetails(prev => ({
                ...prev,
                to: event.target.value
              }));
            }} fullWidth variant='filled' label='Wallet Address' InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Wallet />
                </InputAdornment>)
            }} />
          </div>
          <div className='m-4 p-4 flex flex-col border-blue-900 border rounded-md '>
            <div className='font-bold text-3xl my-2'>
              {txDetails?.amount} ETH
            </div>
            <div>
              From: {wallet?.address} (you)
            </div>
            <div>
              To: {txDetails?.to}
            </div>
            <div>
              Status: {txDetails?.status}
            </div>
          </div>
        </DialogContent>
        <DialogActions className='m-4 gap-4'>
          <Button color='error' endIcon={
            <FontAwesomeIcon fontSize={14} icon={solid('xmark')} />
          } variant='contained' onClick={() => setSendOpen(false)}>
            Cancel
          </Button>
          <LoadingButton loading={sending} color='success' endIcon={
            <FontAwesomeIcon fontSize={14} icon={solid('paper-plane')} />
          } variant='contained' onClick={async () => {
            if (wallet === null) return;
            if (rpcBlockProvider === null) return;
            setSending(true);
            await sendEther({
              provider: rpcBlockProvider,
              sender: txDetails.from,
              receiver: txDetails.to,
              amount: String(txDetails.amount),
              privateKey: wallet?.privateKey!
            }).then(res => {
              setTxDetails(prev => ({
                type: 'send',
                from: '',
                to: '',
                amount: 0,
                status: 'notstarted'
              }));
              setSending(false);
              setSendOpen(false);
            });
          }}>
            Send
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <div className='h-16' />
      <div className='mx-auto'>
        <div className='py-2 flex px-4 border-[0.01em] border-[#a5a0a0] rounded-3xl bg-slate-300'>
          <FontAwesomeIcon fontSize={20} className='mr-3 inline' icon={icon({
            name: 'wallet',
          })} />
          <div className=' w-44 overflow-hidden text-ellipsis cursor-pointer' onClick={() => {
            navigator.clipboard.writeText(wallet?.address ?? '');
          }}>
            {wallet?.address ?? 'No wallet Detected'}
          </div>
        </div>
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
            <FontAwesomeIcon color='white' fontSize={27} icon={icon({ name: 'angles-up' })} />
            <div className='text-white'>
              Send
            </div>
          </div>
          <div className='flex transition-transform ease-[cubic-bezier(0.1,0.05,0.71)] shadow-2xl flex-col hover:scale-105 justify-center items-center rounded-[50%] h-24 w-24 font-medium hover:bg-blue-800 hover:cursor-pointer bg-blue-900'>
            <FontAwesomeIcon color='white' fontSize={27} icon={icon({ name: 'angles-down' })} />
            <div className='text-white'>
              Receive
            </div>
          </div>
        </div>
        <div className='w-full'>
          <div className='m-4 font-bold text-xl'>
            Transactions
          </div>
          {transactions.map((transaction, index) => (
            <div key={index} className='border hover:cursor-pointer hover:bg-slate-200 gap-4 flex items- justify-between rounded-md m-4 p-4 border-blue-900 shadow-lg h-24'>
              <div className='flex gap-4 items-center'>
                <div className='h-16 w-16 flex-col rounded-full bg-blue-700 flex items-center justify-center'>
                  {transaction.from === wallet?.address ? <FontAwesomeIcon fontSize={20} color='white' icon={icon({
                    name: 'caret-down'
                  })} /> : <FontAwesomeIcon fontSize={20} color='white' icon={icon({ name: 'caret-up' })} />}
                </div>
                <div>
                  <div className='w-52 overflow-hidden text-ellipsis text-xl font-bold text-blue-800'>
                    {transaction.hash}
                  </div>
                  <div className='w-52 overflow-hidden text-ellipsis text-slate-900'>
                    {transaction.from}
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-center'>
                <div className='text-md justify-end w-12 overflow-hidden text-ellipsis font-[200]'>
                  {(transaction.value)}
                </div>
                <div className='flex w-12 justify-start font-semibold overflow-hidden text-ellipsis'>
                  {transaction.asset}
                </div>
              </div>
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