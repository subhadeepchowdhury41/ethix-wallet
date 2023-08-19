import { Grow, Snackbar } from "@mui/material";
import React, { useContext, createContext, useState } from "react";

interface SnackBarContexType {
  showSnackBar: (mes: string) => void
};

const SnackBarContext = createContext<SnackBarContexType>({
  showSnackBar: (mes: string) => { }
});

export const SnackBarProvider = ({ children }: {
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const showSnackBar = (mes: string) => {
    setMessage(mes);
    setOpen(true);
  }
  return (<SnackBarContext.Provider value={{ showSnackBar: showSnackBar }}>
    <Snackbar message={message} onClose={() => setOpen(false)} TransitionComponent={Grow} open={open} />
    {children}
  </SnackBarContext.Provider>);
}

export const useSnackContext = () => useContext(SnackBarContext);