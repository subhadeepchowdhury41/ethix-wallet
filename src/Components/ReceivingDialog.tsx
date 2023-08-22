import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { receiveEther } from "../Services/EthServices";
import { useWallet } from "../Providers/WalletProvider";
import { useRPCUrlContext } from "../Providers/RPCUrlProvider";
import { WebSocketProvider, ethers } from "ethers";
import { useRef, useState } from "react";

const ReceivingDialog = ({ open, onClose }: {
  open: boolean,
  onClose: () => void
}) => {
  const streamRef = useRef<WebSocketProvider | null>(null);
  const { network } = useRPCUrlContext();
  const { wallet } = useWallet();
  const [res, setRes] = useState<ethers.TransactionResponse | null>(null);
  const [listening, setListening] = useState<boolean>(false);
  return (<Dialog fullScreen open={open} onClose={onClose}>
    <DialogTitle>
      {listening ? 'Listening to incoming transactions..' : 'You will listen to the receiving Transactions'}
    </DialogTitle>
    <DialogContent>
      {res !== null ? <div>
        <div>From: {res.from}</div>
        <div>Transaction Hash: {res.hash}</div>
        {/* <div>{res.value }</div> */}
      </div> : null}
    </DialogContent>
    <DialogActions>
      <Button variant="contained" color="error" onClick={() => {
        onClose();
      }}>
        Cancel
      </Button>
      {!listening ? <Button variant="contained" color="primary" onClick={async () => {
        if (wallet === null) return;
        if (network === null) return;
        setListening(true);
        streamRef.current = await receiveEther({
          url: network.url,
          privateKey: wallet.privateKey,
          onReceive: (tx: ethers.TransactionResponse) => {
            setRes(tx);
            setListening(false);
            streamRef.current?.removeAllListeners();
            // streamRef.current?.destroy();
          }
        });
      }}>
        Start Listening
      </Button> : <Button color="error" onClick={() => {
        setListening(false);
        streamRef.current?.removeAllListeners();
        // streamRef.current?.destroy();
      }} >
        Stop
      </Button>}
    </DialogActions>
  </Dialog >);
};

export default ReceivingDialog;