/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { useRPCUrlContext } from '../Providers/RPCUrlProvider';
import { useRPCBlockProvider } from '../Providers/RPCBlockProvider';
import { SolidButton } from '../Components/CustomButtons';
import { Warning } from '@mui/icons-material';
import { Avatar } from '@mui/material';

const CreatedMnemonics = () => {
  const [copied, setCopied] = useState(false);
  const { state } = useLocation();
  const { phrase } = state;

  const navigate = useNavigate();

  const { network } = useRPCUrlContext();
  const { refreshBlockProvider } = useRPCBlockProvider();

  useEffect(() => {
    if (network === null) return;
    refreshBlockProvider(network.url);
  }, []);

  return (
    <div className="text-lg flex flex-col p-5 justify-between h-screen">
      <div>
        <div className='font-[700] text-5xl'>
          Here's your
        </div>
        <div className='text-3xl font-[200]'>
          Created Mnemonics
        </div>
      </div>
      <div className='flex flex-col gap-8'>
        <div className='border text-sm border-blue-800 rounded-md px-5 py-2 flex justify-between items-center'>
          {phrase ?? 'No Mnemonics Found'}
          <div>
            <button className='border-1 border-black rounded-xl px-2 py-2 bg-[#ccc9c97a] text-sm' onClick={() => {
              navigator.clipboard.writeText(phrase ?? '');
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 3000);
            }}>{copied ? "Copied" : "Copy"}</button>
          </div>
        </div>
        <div className='flex items-center border border-red-400 rounded-md '>
          <Avatar sx={{backgroundColor: '#dfdfdf'}} className='bg-red-100 rounded-full h-[50px] w-[50px] flex items-center justify-center m-5'>
            <Warning color='error' />
          </Avatar>
          <div className='text-sm'>
            Copy and Paste the mnemonics above and save it somewhere safe. You will need it to access your wallet.
          </div>

        </div>
      </div>
      <div className='flex justify-end'>
        <div className='flex '>
          <SolidButton label='Go to Dashboard' onClick={() => {
            navigate('/dashboard');
          }} />
        </div>
      </div>
    </div>
  )
}

export default CreatedMnemonics;