/* eslint-disable react-hooks/exhaustive-deps */
import { TextField } from "@mui/material";
import { OutlinedButton, SolidButton } from "../Components/CustomButtons";
import { EncryptedWallet, useAccountsContext } from "../Providers/AccountProviders";
import { generateWallet, getEncryptedMnemonics } from "../Utils/MnemonicsUtils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useWallet } from "../Providers/WalletProvider";
import * as DOMPurify from 'dompurify';

const CreateWallet = () => {
  function cleanData(inputHtml: string): string {
    const sanitizedHtml = DOMPurify.sanitize(inputHtml);
    console.log(sanitizedHtml);
    localStorage.setItem("xss",sanitizedHtml)
    
    return sanitizedHtml;
  }
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({ accountName: null, password: null });
  const { mnemonics, setMnemonics, setDefaultMnemonics } = useAccountsContext();
  const [accountName, setAccountName] = useState<string>('Account 1');
  const [password, setPassword] = useState<string>('');
  const {refreshWallet} = useWallet();
  useEffect(() => {
    setErrors({ accountName: null, password: null })
    if (accountName === '' || accountName === null) {
      setErrors({ ...errors, accountName: 'Account name cannot be empty' });
      return;
    }
    setErrors({ ...errors, accountName: null });
    if (password === '' || password === null) {
      setErrors({ ...errors, password: 'Password cannot be empty' });
      return;
    }
    if (password.length < 8) {
      setErrors({ ...errors, password: 'Password must be at least 8 characters long' });
      return;
    }
    setErrors({ ...errors, password: null });
    
  }, [accountName, password]);
  return (
    <div className="text-lg flex flex-col p-5 justify-between h-screen">
      <div className='flex flex-col gap-2'>
        <div className='font-[700] text-5xl'>
          Hi,
        </div>
        <div className='text-3xl font-[200]'>
          Create your ETH wallet
        </div>
      </div>
      <div className="gap-6 flex flex-col">
        <TextField label='Account Name' value={accountName} onChange={(event) => {
          setAccountName(event.target.value);
        }} helperText={errors.accountName} error={Boolean(errors.accountName !== null)} variant="filled" />
        <TextField label='Password' type='password' value={password} variant="filled" onChange={(event) => {
          setPassword(event.target.value);
        }} helperText={errors.password} error={Boolean(errors.password !== null)} />
      </div>
      <div className='flex flex-col gap-4'>
        <SolidButton label='Create Wallet' onClick={() => {
          if (accountName === '' || accountName === null) {
            setErrors({ ...errors, accountName: 'Account name cannot be empty' });
            return;
          }
          if (password === '' || password === null) {
            setErrors({ ...errors, password: 'Password cannot be empty' });
            return;
          }
          if (password.length < 8) {
            setErrors({ ...errors, password: 'Password must be at least 8 characters long' });
            return;
          }
          const wallet = generateWallet();
          if (wallet === null || wallet.mnemonic?.phrase === null || wallet.mnemonic?.phrase === null) return;
          let createdEncryptedMnemonics = {
            mnemonics: getEncryptedMnemonics(wallet.mnemonic?.phrase!, password),
            name: cleanData(accountName)
          };
          
          setMnemonics(([...mnemonics, createdEncryptedMnemonics] as EncryptedWallet[]));
          setDefaultMnemonics(createdEncryptedMnemonics);
          refreshWallet(createdEncryptedMnemonics.mnemonics, password);
          navigate('/created', { state: { phrase: wallet.mnemonic?.phrase, address: wallet.address } });
        }} />
        <OutlinedButton label='Restore Wallet With Mnemonics' onClick={() => {
          navigate('/restore');
        }} />
      </div>

    </div>);
};

export default CreateWallet;