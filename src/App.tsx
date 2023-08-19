import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CreateWallet from './Screens/CreateWallet';
import RestoreWallet from './Screens/RestoreWallet';
import CreatedMnemonics from './Screens/CreatedMnemonics';
import Settings from './Screens/Settings';
import Dashboard from './Screens/Dashboard';
import { RPCBlockProviderProvider } from './Providers/RPCBlockProvider';
import { RPCUrlProvider } from './Providers/RPCUrlProvider';
import { WalletProvider } from './Providers/WalletProvider';
import SentTransaction from './Screens/SentTransaction';
import { AccountsProvider } from './Providers/AccountProviders';
import Onboarding from './Screens/Onboarding';
import AddUrl from './Screens/addUrl';

function App() {
  return (
    <div>
      <AccountsProvider>
        <RPCUrlProvider>
          <RPCBlockProviderProvider>
            <WalletProvider>
              <Router>
                <Routes>
                  <Route path='/' element={<Onboarding />} />
                  <Route path='/create' element={<CreateWallet />} />
                  <Route path='/restore' element={<RestoreWallet />} />
                  <Route path='/created' element={<CreatedMnemonics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/sent" element={<SentTransaction />} />
                  <Route path="/addUrl" element={<AddUrl/>} />
                </Routes>
              </Router>
            </WalletProvider>
          </RPCBlockProviderProvider>
        </RPCUrlProvider>
      </AccountsProvider>
    </div>
  );
}

export default App;
