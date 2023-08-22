/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as DOMPurify from 'dompurify';
import { useRPCUrlContext } from "../Providers/RPCUrlProvider";
import { LoadingButton } from "@mui/lab";
import { verifyRPCUrl } from "../Services/EthServices";

const AddUrl = () => {
  function cleanData(inputHtml: string): string {
    const sanitizedHtml = DOMPurify.sanitize(inputHtml);
    console.log(sanitizedHtml);
    localStorage.setItem("xss", sanitizedHtml)
    return sanitizedHtml;
  }
  const { addNetwork } = useRPCUrlContext();
  const [error, setError] = useState<any>(null);
  const [url, setUrl] = useState<string>('');
  const navigate = useNavigate();
  return (
    <div className="flex flex-col item-center p-5 justify-center w-full h-screen">
      <div className="flex flex-col justify-between h-screen">
        <div className='font-[700] text-5xl'>
        </div>
        <div>
          <div className="text-2xl font-bold">
            Enter network url to add
          </div>
          <div className="text-xl font-thin mb-4">
            to add to your wallet
          </div>
          <TextField fullWidth error={Boolean(error)} label={
            'Enter your url to add '
          } helperText={ error} value={url} variant="filled" onChange={(event) => {
            setUrl(event.target.value);
          }} />
        </div>
        <div className="flex justify-end ">
          <LoadingButton loading={ false} variant="contained" disableElevation sx={{
            borderRadius: '17px'
          }} onClick={async () => {
            let sanitizedUrl = cleanData(url);
            let valid = verifyRPCUrl(sanitizedUrl);
            if (!valid) {
              setError('Invalid RPC URL');
              return;
            }
            setError(null);
            addNetwork(sanitizedUrl);
            navigate('/dashboard');
          }}>
            Add URL
          </LoadingButton>
        </div>

      </div>
    </div>
  );
}

export default AddUrl;