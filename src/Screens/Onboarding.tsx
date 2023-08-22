/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAccountsContext } from "../Providers/AccountProviders";
import { useWallet } from "../Providers/WalletProvider";
import { TextField, Tooltip } from "@mui/material";
import { SolidButton } from "../Components/CustomButtons";
import { useNavigate } from "react-router-dom";
import AccountsDropdown from "../Components/AccountsDropdown";

const Onboarding = () => {
  const { defaultMnemonics } = useAccountsContext();
  const { refreshWallet } = useWallet();
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  useEffect(() => {
    if (defaultMnemonics !== null) return;
    window.location.href = '/create';
  }, []);
  return (
    <div className="flex flex-col item-center p-5 justify-center w-full h-screen">
      {
        defaultMnemonics !== null && (
          <div className="flex flex-col justify-between h-screen">
            <Tooltip title={defaultMnemonics.name}>
              <AccountsDropdown />
            </Tooltip>
            <div>
              <div className="text-2xl font-bold">
                Enter passkey
              </div>
              <div className="text-xl font-thin mb-4">
                to access your wallet
              </div>
              <TextField fullWidth label={
                'Enter your Passkey For ' + defaultMnemonics.name
              } type='password' value={password} variant="filled" onChange={(event) => {
                setPassword(event.target.value);
              }} />
            </div>
            <div className="flex justify-end ">
              <SolidButton label='Unlock Wallet' onClick={() => {
                if (defaultMnemonics === null) return;
                refreshWallet(defaultMnemonics.mnemonics, password);
                navigate('/dashboard');
              }} />
            </div>

          </div>
        )
      }
    </div>
  );
}

export default Onboarding;