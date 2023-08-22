/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext } from "react";
import { useLocalState } from "../Utils/CustomHooks";

export interface RPCUrlContextType {
  network: RPCNetwork;
  setNetwork: (network: RPCNetwork) => void;
  rpcNetworks: RPCNetwork[];
  addNetwork: (url: string) => void;
};

export interface RPCNetwork {
  url: string;
  name: string;
  image: string;
}


const RPCUrlContext = createContext<RPCUrlContextType>({
  setNetwork: () => { },
  network: {
    url: '',
    name: '',
    image: ''
  },
  rpcNetworks: [],
  addNetwork: () => { }
});

const networkTemplate = {
  'https://mainnet.infura.io/': 'Mainnet',
  'https://ropsten.infura.io/': 'Ropsten',
  'https://kovan.infura.io/': 'Kovan',
  'https://rinkeby.infura.io/': 'Rinkeby',
  'https://goerli.infura.io/': 'Goerli',
  'https://sepolia.infura.io/': 'Sepolia',
  'http://localhost:8545': 'Localhost'
}

export const RPCUrlProvider = ({ children }: { children: React.ReactNode }) => {
  const [rpcNetworks, setRPCNetworks] = useLocalState<RPCNetwork[]>({
    name: 'rpcNetworks', initialValue: [{
      url: 'https://sepolia.infura.io/v3/90b718b2d70c4de7993a2fc422c5a652',
      name: 'Sepolia',
      image: ''
    }, {
      url: 'https://mainnet.infura.io/v3/90b718b2d70c4de7993a2fc422c5a652',
      name: 'Mainnet',
      image: ''
    }, {
      url: 'https://ropsten.infura.io/v3/90b718b2d70c4de7993a2fc422c5a652',
      name: 'Ropsten',
      image: ''
    }, {
      url: 'http://localhost:8545',
      name: 'Localhost',
      image: ''
    },]
  });
  const getNetwork = (url: string) => {
    for (const [key, value] of Object.entries(networkTemplate)) {
      if (url.includes(key)) {
        console.log(value);
        return value;
      }
    }
  }
  const addNetwork = (url: string) => {
    const network = getNetwork(url);
    if (network === undefined) return;
    const newNetwork: RPCNetwork = {
      url: url,
      name: network,
      image: ''
    };
    setRPCNetworks([...rpcNetworks, newNetwork]);
  }
  const [network, setNetwork] = useLocalState<RPCNetwork>({
    name: 'currentNetwork',
    initialValue: {
      url: 'https://sepolia.infura.io/v3/90b718b2d70c4de7993a2fc422c5a652',
      name: 'Sepolia',
      image: ''
    }
  });
  return (
    <RPCUrlContext.Provider value={{ network, setNetwork, rpcNetworks, addNetwork }}>
      {children}
    </RPCUrlContext.Provider>
  );
}

export const useRPCUrlContext = () => useContext(RPCUrlContext);