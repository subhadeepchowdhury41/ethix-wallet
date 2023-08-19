/* eslint-disable react-hooks/exhaustive-deps */
import { JsonRpcProvider, ethers } from "ethers";
import React, { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { useRPCUrlContext } from "./RPCUrlProvider";

interface RPCBlockProviderContextType {
  rpcBlockProvider: JsonRpcProvider | null;
  setRPCBlockProvider: Dispatch<SetStateAction<JsonRpcProvider | null>>;
  refreshBlockProvider: (rpcUrl: string) => void;
};

const RPCBlockProviderContext = createContext<RPCBlockProviderContextType>({
  rpcBlockProvider: null,
  setRPCBlockProvider: () => { },
  refreshBlockProvider: (rpcUrl) => { }
});

export const RPCBlockProviderProvider = ({ children }: { children: React.ReactNode }) => {
  const [rpcBlockProvider, setRPCBlockProvider] = useState<JsonRpcProvider | null>(null);
  const refreshBlockProvider = (rpcUrl: string) => {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    setRPCBlockProvider(provider);
  }
  const { network } = useRPCUrlContext();
  useEffect(() => {
    if (network === null) return;
    refreshBlockProvider(network.url);
  }, [network]);

  return (
    <RPCBlockProviderContext.Provider value={{
      rpcBlockProvider: rpcBlockProvider,
      setRPCBlockProvider: setRPCBlockProvider,
      refreshBlockProvider: refreshBlockProvider
    }}>
      {children}
    </RPCBlockProviderContext.Provider>
  );
}

export const useRPCBlockProvider = () => useContext(RPCBlockProviderContext);