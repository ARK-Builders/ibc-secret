import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import GameArea from "./Components/GameArea";
import React, { useState, useEffect } from 'react';

const App = () => {
  const [address, setaddress] = useState(null);

    useEffect(() => {
    const fetchBalance = async () => {
      if (window.keplr) {
        // Check if Keplr extension is installed
        if (window.getOfflineSigner) {
          // Check if the Keplr extension is loaded
          const keplr = window.getOfflineSigner('cosmoshub-4'); // Replace with your chain ID

          try {
            // Get the address of the connected wallet
            const accounts = await keplr.getAccounts();

            setaddress(accounts[0].address);

          } catch (error) {
            console.error('Error fetching address:', error);
          }
        } else {
          console.error('Keplr extension not loaded');
        }
      } else {
        console.error('Keplr extension not installed');
      }
    };

    fetchBalance();
  }, []);

    const handleConnectWallet = async () => {
    if (window.keplr) {
      try {
      const keplr = window.getOfflineSigner('cosmoshub-4');
      const accounts = await keplr.getAccounts(); // Replace with your chain ID
      setaddress(accounts[0].address);
      } catch (error) {
            console.error('Error fetching address:', error);
          }
    } else {
      console.error('Keplr extension not installed');
    }
  };

  return (
    <div className="App">
      <GameArea handleConnectWallet={handleConnectWallet} address={address}/>
    </div>
  );
}

export default App;
