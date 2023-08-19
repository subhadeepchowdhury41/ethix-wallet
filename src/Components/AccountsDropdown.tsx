import { Avatar, Menu, MenuItem } from "@mui/material";
import { useAccountsContext } from "../Providers/AccountProviders";
import { useState } from "react";
import { Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AccountsDropdown = () => {
  const [anchor, setAnchor] = useState<null | HTMLElement>();
  const open = Boolean(anchor);
  const navigate = useNavigate();
  const { mnemonics, defaultMnemonics, setDefaultMnemonics } = useAccountsContext();
  return (
    <div >
      <div aria-controls={open ? 'menu1' : undefined}
        onClick={(event) => setAnchor(event.currentTarget)}
        className="cursor-pointer w-36 mx-auto flex border p-1 items-center rounded-[2em] border-blue-900"
      >
        <Avatar >
          <Person />
        </Avatar>
        <div 
          className=" ml-2 w-20 text-ellipsis overflow-hidden line-clamp-1">
          {defaultMnemonics?.name}
        </div>
      </div>

      <Menu open={open} anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }} anchorEl={anchor} onClose={() => setAnchor(null)} sx={{
        '& .MuiMenu-paper': {
          borderRadius: '2em',
          margin: '0.2em',
        }
      }}>
        {mnemonics.map((mnemonic, index) => (
          <MenuItem sx={{
            display: 'flex',
            bgcolor: defaultMnemonics?.name === mnemonic.name ? '#627eaa' : 'white',
            color: defaultMnemonics?.name !== mnemonic.name ? '#627eaa' : 'white',
            '&:hover': {
              bgcolor: defaultMnemonics?.name === mnemonic.name ? '#627eaa' : 'white',
            },
            justifyContent: 'space-between',
            border: '1px solid blue',
            borderRadius: '2em',
            margin: '0.5em',
            padding: '0.2em'
          }} key={index} onClick={() => {
            setAnchor(null);
            setDefaultMnemonics(mnemonic);
            navigate('/');
          }}>
            <Avatar>
              {mnemonic.name[0]}
            </Avatar>
            <div className=" mx-4 w-20 text-ellipsis overflow-hidden line-clamp-1">
              {mnemonic.name}
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>

  );
}

export default AccountsDropdown;