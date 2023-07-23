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
