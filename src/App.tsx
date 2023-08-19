import React, { Fragment } from 'react';
import './App.css';
import { Route, RouteProps, BrowserRouter as Router, Routes } from 'react-router-dom';
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

const ProtectedRoute = (props: RouteProps): React.ReactElement => {
  return (
    <Fragment>
      {
        localStorage.getItem('defaultMnemonics') === null
          || localStorage.getItem('defaultMnemonics') === undefined
          ? <Onboarding /> : props.element
      }
    </Fragment>
  );
}

function App() {
  return (
    <div>
      <AccountsProvider>
        <RPCUrlProvider>
          <RPCBlockProviderProvider>
            <WalletProvider>
              <Router>
                <Routes>
                  <Route path='/' element={<ProtectedRoute element={<Onboarding />}/> } />
                  <Route path='/create' element={<CreateWallet /> } />
                  <Route path='/restore' element={<RestoreWallet /> } />
                  <Route path='/created' element={<ProtectedRoute element={<CreatedMnemonics />}/> } />
                  <Route path="/settings" element={<ProtectedRoute element={<Settings />}/> } />
                  <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />}/> } />
                  <Route path="/sent" element={<ProtectedRoute element={<SentTransaction />}/> } />
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
