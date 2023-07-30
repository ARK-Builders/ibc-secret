import './App.css';
import GameArea from "./Components/GameArea";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { SecretjsContext } from "./secretJs/SecretjsContext";
import React, {useContext, useState } from 'react';
import { SecretjsFunctions } from "./secretJs/SecretjsFunctions";

const App = () => {
  const [address, setaddress] = useState(null);
  const { connectWallet } = useContext(SecretjsContext);
    const { create_deck, increment, enough_cards, query_2cards, query_card, query_deck, query_win } =
    SecretjsFunctions();

    const handleConnectWallet = async () => {
      try { 
        await window.keplr.experimentalSuggestChain({
          chainId: "secret-4",
          chainName: "Secret Network",
          rpc: "https://rpc.secret.express",
          rest: "https://lcd.secret.express",
          bip44: {
              coinType: 118,
          },
          bech32Config: {
              bech32PrefixAccAddr: "secret",
              bech32PrefixAccPub: "secret" + "pub",
              bech32PrefixValAddr: "secret" + "valoper",
              bech32PrefixValPub: "secret" + "valoperpub",
              bech32PrefixConsAddr: "secret" + "valcons",
              bech32PrefixConsPub: "secret" + "valconspub",
          },
          currencies: [ 
              { 
                  coinDenom: "SCRT", 
                  coinMinimalDenom: "uscrt", 
                  coinDecimals: 6, 
                  coinGeckoId: "secret", 
              }, 
          ],
          feeCurrencies: [
              {
                  coinDenom: "SCRT",
                  coinMinimalDenom: "uscrt",
                  coinDecimals: 6,
                  gasPriceStep: {
                      low: 0.01,
                      average: 0.025,
                      high: 0.04,
                  },
              },
          ],
          stakeCurrency: {
              coinDenom: "SCRT",
              coinMinimalDenom: "uscrt",
              coinDecimals: 6,
              coinGeckoId: "secret", 
          },
      });

    } catch (error) {
      alert(
        "An error occurred while adding network. Please try again."
      );
    }
      setaddress(await connectWallet());
  };


  return (
    <div className="App cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      <Header handleConnectWallet={handleConnectWallet} address={address}/>
      <GameArea  create_deck={create_deck} increment={increment} enough_cards={enough_cards} query_2cards = {query_2cards} query_card = {query_card} query_deck = {query_deck} query_win = {query_win} address={address}/>
      <Footer />
    </div>
  );
}

export default App;
