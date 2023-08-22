/* eslint-disable react-hooks/exhaustive-deps */
// you know what to do
import { TransactionResponse, ethers } from 'ethers';
import React, { createContext, useContext, useEffect } from 'react';
import { useLocalState } from '../Utils/CustomHooks';
import { useAccountsContext } from './AccountProviders';
import { useWallet } from './WalletProvider';
import { useRPCUrlContext } from './RPCUrlProvider';

interface IncomingTransactionContextType {
  incomingTransactions: TransactionResponse[],
  setIncomingTransactions: (transactions: TransactionResponse[]) => void
}

const IncomingTransactionContext = createContext<IncomingTransactionContextType>({
  incomingTransactions: [],
  setIncomingTransactions: () => { }
});

export const IncomingTransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const { defaultMnemonics } = useAccountsContext();
  const receiveEther = async ({ privateKey, url }: {
    privateKey: string,
    url: string
  }) => {
    const wsProvider = new ethers.WebSocketProvider(String(url).replace('https', 'wss').replace('io/', 'io/ws/'));
    const wallet = new ethers.Wallet(privateKey, wsProvider);
    const receipentAddress = wallet.address;

    wsProvider.on('pending', async (tx) => {
      try {
        const transaction = await wsProvider.getTransaction(tx);
        if (transaction?.to === receipentAddress) {
          console.log('Transaction received');
          console.log(transaction);
          setIncomingTransactions([...incomingTransactions, transaction]);
        }
      } catch (err) {
        console.error(err);
      }
    });
    console.log('Listening to incoming transaction to receipent address: ' + receipentAddress);
  }
  const [incomingTransactions, setIncomingTransactions] = useLocalState<TransactionResponse[]>({
    name: 'incomingTransactions-' + (defaultMnemonics?.name ?? ''),
    initialValue: []
  });
  const { wallet } = useWallet();
  const { network } = useRPCUrlContext();
  useEffect(() => {
    if (wallet === null) return;
    if (network === null) return;
    receiveEther({ url: network.url, privateKey: wallet?.privateKey });
  }, [wallet]);
  return (
    <IncomingTransactionContext.Provider value={{
      incomingTransactions,
      setIncomingTransactions
    }}>
      {children}
    </IncomingTransactionContext.Provider>
  );
}

export const useIncomingTransactionContext = () => useContext(IncomingTransactionContext);
