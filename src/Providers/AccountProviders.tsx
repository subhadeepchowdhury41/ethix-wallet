import { createContext, useContext } from "react";
import { useLocalState } from "../Utils/CustomHooks";

export interface EncryptedWallet {
  mnemonics: string;
  name: string;
}

interface AccountsContextType {
  mnemonics: EncryptedWallet[];
  defaultMnemonics: EncryptedWallet | null;
  setMnemonics: (mnemonics: EncryptedWallet[]) => void;
  setDefaultMnemonics: (mnemonics: EncryptedWallet) => void;
};

const AccountsContext = createContext<AccountsContextType>({
  mnemonics: [],
  setDefaultMnemonics: () => { },
  setMnemonics: () => { },
  defaultMnemonics: null
});

export const AccountsProvider = ({ children }: { children: React.ReactNode }) => {
  const [mnemonics, setMnemonics] = useLocalState<EncryptedWallet[]>({ name: 'mnemonics', initialValue: [] });
  const [defaultMnemonics, setDefaultMnemonics] = useLocalState<EncryptedWallet|null>({
    name: 'defaultMnemonics',
    initialValue: null
  });
  return (
    <AccountsContext.Provider value={{
      mnemonics: mnemonics,
      setMnemonics: setMnemonics,
      setDefaultMnemonics: setDefaultMnemonics,
      defaultMnemonics: defaultMnemonics
    }}>
      {children}
    </AccountsContext.Provider>
  );
}

export const useAccountsContext = () => {
  return useContext(AccountsContext);
}