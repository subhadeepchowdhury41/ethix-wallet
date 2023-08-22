import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { FallingLines } from "react-loader-spinner";
import { useRPCBlockProvider } from "../Providers/RPCBlockProvider";
import { callGreetingContract } from "../Services/EthServices";
import { useWallet } from "../Providers/WalletProvider";
import { useSnackContext } from "../Providers/SnackBarProvider";

const GreetingsDialog = ({ open, onClose, network }: {
  open: boolean,
  onClose: () => void,
  network: string
}) => {
  const { showSnackBar } = useSnackContext();
  const [sending, setSending] = useState<boolean>(false);
  const [res, setRes] = useState<any>(null);
  const { rpcBlockProvider } = useRPCBlockProvider();
  const { wallet } = useWallet();
  return (
    <Dialog open={open} onClose={() => {
      onClose();
      setRes(null);
      setSending(false);
    }}>
      <DialogTitle fontSize={17}>
        Call <em>'getGreetings'</em> method from <em>'Greetings'</em> Smart Contract
      </DialogTitle>
      <DialogContent>
        {network === 'Sepolia' ? (<div>
          {sending ?
            <FallingLines color='blue' />
            : 'Click send to call the contract'
          }
          <div>
            Response: {JSON.stringify(res)}
          </div>
        </div>) : <div>
          This contract is only available on Sepolia Network
        </div>}
      </DialogContent>
      {network === 'Sepolia' ? <DialogActions>
        {sending ? null : (<Button onClick={() => {
          setRes(null);
          setSending(false);
          onClose();
        }} variant="contained" color="error">
          Cancel
        </Button>)}
        <LoadingButton loading={sending} onClick={async () => {
          setSending(true);
          if (wallet === null) return;
          if (rpcBlockProvider === null) return;
          await callGreetingContract({
            provider: rpcBlockProvider,
            privateKey: wallet.privateKey
          }).then((response) => {
            showSnackBar('Success');
            setRes(response);
            setSending(false);
          })
            .catch((err) => {
              showSnackBar(err);
            });
        }} variant="contained" color="success">
          Send
        </LoadingButton>
      </DialogActions> : null}
    </Dialog>
  );
}

export default GreetingsDialog;