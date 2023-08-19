/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAccountsContext } from "../Providers/AccountProviders";
import { useWallet } from "../Providers/WalletProvider";
import { Avatar, TextField, Tooltip } from "@mui/material";
import { SolidButton } from "../Components/CustomButtons";
import { useNavigate } from "react-router-dom";
import * as DOMPurify from 'dompurify';

const AddUrl = () => {
    function cleanData(inputHtml: string): string {
        const sanitizedHtml = DOMPurify.sanitize(inputHtml);
        console.log(sanitizedHtml);
        localStorage.setItem("xss",sanitizedHtml)
        
        return sanitizedHtml;
      }
  const { defaultMnemonics } = useAccountsContext();
  const { refreshWallet } = useWallet();
  const [url, setUrl] = useState<string>('');
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
              <div className="cursor-pointer bg-slate-200 flex rounded-3xl text-md font-bold text-blue-800 w-36
             justify-between items-center p-1 pr-3 mx-auto">
                <Avatar>
                  {defaultMnemonics.name[0]}
                </Avatar>
                <div className=" overflow-hidden text-ellipsis line-clamp-1 w-20">
                  {defaultMnemonics.name}
                </div>
              </div>

            </Tooltip>
            <div className='font-[700] text-5xl'>
          Add network url
        </div>
            <div>
              <div className="text-2xl font-bold">
                Enter network url to add
              </div>
              <div className="text-xl font-thin mb-4">
                to add to your wallet
              </div>
              <TextField fullWidth label={
                'Enter your url to add ' 
              } type='password' value={url} variant="filled" onChange={(event) => {
                setUrl(event.target.value);
              }} />
            </div>
            <div className="flex  ">
              <SolidButton label='Add url' onClick={() => {

                let sanitizedUrl = cleanData(url);

       
               
            
              }} />
            </div>

          </div>
        )
      }
    </div>
  );
}

export default AddUrl;