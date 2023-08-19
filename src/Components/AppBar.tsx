import Logo from '../assets/logo/logo.png';
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { RPCNetwork, useRPCUrlContext } from "../Providers/RPCUrlProvider";
import { Restore, SettingsOutlined, WebStories } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import * as DOMPurify from 'dompurify';
import AccountsDropdown from './AccountsDropdown';

const AppBar = () => {
  function cleanData(inputHtml: string): string {
    const sanitizedHtml = DOMPurify.sanitize(inputHtml);
    console.log(sanitizedHtml);
    localStorage.setItem("xss", sanitizedHtml)

    return sanitizedHtml;
  }
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<null | HTMLElement>();
  const { network, setNetwork, rpcNetworks } = useRPCUrlContext();
  const open = Boolean(anchor);
  return (<div className="fixed top-0 z-10 flex w-full bg-[#fefefe] h-16 shadow-md items-center justify-between">
    <div>
      <img src={Logo} alt="logo" className="h-14 w-14 ml-2" />
    </div>
    <AccountsDropdown />
    <div className="flex gap-4 items-center">
      <select value={JSON.stringify(network)} onChange={(event) => setNetwork(JSON.parse(event.target.value) as RPCNetwork)} className="border hover:cursor-pointer text-lg focus:outline-none
       focus:border-blue-950 border-blue-800 font-medium bg-slate-100 rounded-full p-2">
        {rpcNetworks.map((net, index) => (
          <option key={index} value={JSON.stringify(net)} className="border border-blue-100">
            <div className="m-10 border">
              {net.name}
            </div>
          </option>
        ))}
      </select>
      <div onClick={(event) => setAnchor(event.currentTarget)}>
        <IconButton aria-controls={open ? 'menu' : undefined}>
          <SettingsOutlined fontSize="large" />
        </IconButton>
      </div>
      <Menu open={open} anchorEl={anchor} onClose={() => setAnchor(null)}>
        <MenuItem onClick={() => navigate('/addUrl')}>
          <WebStories sx={{
            marginRight: '10px'
          }} />
          Add New RPC URL
        </MenuItem>
        <MenuItem onClick={() => navigate('/restore')}>
          <Restore sx={{
            marginRight: '10px'
          }} />
          Restore Account From Mnemonics
        </MenuItem>
      </Menu>
    </div>
  </div>);
}

export default AppBar;