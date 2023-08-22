import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Wallet } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useWallet } from "../Providers/WalletProvider";
import { useRPCBlockProvider } from "../Providers/RPCBlockProvider";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { sendEther } from "../Services/EthServices";


interface TxDetailsType {
  type: 'send' | 'receive',
  amount: number | null,
  from: string,
  to: string,
  status: string
};

const SendingDialog = ({ open, onClose, network }: {
  open: boolean,
  onClose: () => void,
  network: string
}) => {
  const [sending, setSending] = useState(false);
  const [txDetails, setTxDetails] = useState<TxDetailsType>({
    type: 'send',
    from: '',
    to: '',
    amount: 0,
    status: 'notstarted'
  });
  const { wallet } = useWallet();
  const { rpcBlockProvider } = useRPCBlockProvider();
  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogTitle sx={{
        fontSize: '23px',
        display: 'flex',
        justifyContent: 'justify-between',
        alignItems: 'center',
        margin: '0 1rem',
        gap: '1rem',
        fontWeight: 'bold'
      }}>
        <div>
          Send Ether to wallet
        </div>

        <div className='text-sm font-normal bg-slate-400 text-ellipsis line-clamp-1
            h-6 w-16 rounded-xl overflow-hidden text-white flex items-center justify-center'>
          {network}
        </div>
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
        } variant='contained' onClick={onClose}>
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
            onClose();
          });
        }}>
          Send
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default SendingDialog;