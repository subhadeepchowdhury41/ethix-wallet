import React, { createContext, useContext, useState } from 'react';
import { getDecryptedMnemonics, restoreWallet } from '../Utils/MnemonicsUtils';
import { HDNodeWallet } from 'ethers';

interface WalletContextProps {
  wallet: HDNodeWallet | null;
  refreshWallet: (mnemonic: string, pass: string) => void;
};

const WalletContext = createContext<WalletContextProps>({
  wallet: null,
  refreshWallet: () => {}
});

export const WalletProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const [wallet, setWallet] = useState<HDNodeWallet | null>(null);
  const refreshWallet = (mnemonic: string, pass: string) => {
    const mnemonics = getDecryptedMnemonics(mnemonic, pass);
    if (!mnemonics) return console.log('no mnemonics');
    const wallet = restoreWallet(mnemonics);
    setWallet(wallet);
  }
  return (
    <WalletContext.Provider value={{wallet, refreshWallet: refreshWallet}}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext);