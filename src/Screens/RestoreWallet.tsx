/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { OutlinedButton, SolidButton } from "../Components/CustomButtons";
import { getEncryptedMnemonics } from "../Utils/MnemonicsUtils";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { useAccountsContext } from "../Providers/AccountProviders";
import { useWallet } from "../Providers/WalletProvider";
import * as DOMPurify from 'dompurify';
const RestoreWallet = () => {




  function cleanData(inputHtml: string): string {
    const sanitizedHtml = DOMPurify.sanitize(inputHtml);
    console.log(sanitizedHtml);
    localStorage.setItem("xss",sanitizedHtml)
    
    return sanitizedHtml;
  }
  const navigate = useNavigate();
  const [mnemonicsPhrase, setMnemonicsPhrase] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({ accountName: null, password: null });
  const [accountName, setAccountName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
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
  const { setDefaultMnemonics, setMnemonics, mnemonics } = useAccountsContext();
  const {refreshWallet} = useWallet();
  return (
    <div className="text-lg flex flex-col p-5 justify-between h-screen">
      <div className='flex flex-col gap-2'>
        <div className='font-[700] text-5xl'>
          Hey there,
        </div>
        <div className='text-3xl font-[200]'>
          Enter your mnemonics
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 ">
        <label className="font-[300] text-sm">
          Mnemonics
        </label>
        <textarea className='border w-full border-black rounded-md p-2' onChange={(e) => {
          setMnemonicsPhrase(e.target.value);
        }} />
        {error && <div className='text-red-500'>{error}</div>}
      </div>
      <div className="gap-6 flex flex-col">
        <TextField size='small' label='Account Name' value={accountName} onChange={(event) => {
          setAccountName(event.target.value);
        }} helperText={errors.accountName} error={Boolean(errors.accountName !== null)} variant="filled" />
        <TextField size='small' label='Password' type='password' value={password} variant="filled" onChange={(event) => {
          setPassword(event.target.value);
        }} helperText={errors.password} error={Boolean(errors.password !== null)} />
      </div>
      <div className='flex flex-col gap-5'>
        <SolidButton label='Restore Wallet With Mnemonics' onClick={() => {
          if (!mnemonicsPhrase) {
            return;
          }
          console.log(accountName);
          
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
          try {
            let encryptedMnemonics = {
              mnemonics: getEncryptedMnemonics(cleanData(mnemonicsPhrase), password),
              name: cleanData(accountName)
            };
            setDefaultMnemonics(encryptedMnemonics);
            setMnemonics([...mnemonics, encryptedMnemonics]);
            refreshWallet(encryptedMnemonics.mnemonics, password);
            setError(null);
            navigate('/dashboard');
          } catch (e) {
            setError('Invalid Mnemonics');
            return;
          }
        }} />
        <OutlinedButton label='Create Wallet' onClick={() => {
          navigate('/create');
        }} />
      </div>

    </div>);
};

export default RestoreWallet;