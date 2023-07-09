import { useContext } from "react";
import { MsgExecuteContract } from "secretjs";
import { SecretjsContext } from "./SecretjsContext";

let contractCodeHash =
  "6ac05b4b6cb8b067260228b2ff63c777a4e69907a16eaf827cb5766928445efe";
let contractAddress = "secret1d84xm44zk35z4wm6dr26ns6n0wlydt8ccartfe";

const SecretjsFunctions = () => {
  const { secretjs, secretAddress } = useContext(SecretjsContext);

  let submit_net_worth = async (millionaire1, millionaire2) => {
    const millionaire1_tx = new MsgExecuteContract({
      sender: secretAddress,
      contract_address: contractAddress,
      msg: {
        submit_net_worth: {
          name: millionaire1.name,
          worth: parseInt(millionaire1.networth),
        },
      },
      code_hash: contractCodeHash,
    });

    const millionaire2_tx = new MsgExecuteContract({
      sender: secretAddress,
      contract_address: contractAddress,
      msg: {
        submit_net_worth: {
          name: millionaire2.name,
          worth: parseInt(millionaire2.networth),
        },
      },
      code_hash: contractCodeHash,
    });
    const txs = await secretjs.tx.broadcast(
      [millionaire1_tx, millionaire2_tx],
      {
        gasLimit: 300_000,
      }
    );
    console.log(txs);
  };
  // submit_net_worth(millionaire1, millionaire2);

  let create_deck = async () => {
    const tx = await secretjs.tx.compute.executeContract(
      {
        sender: secretAddress,
        contract_address: contractAddress,
        msg: {
          deck: {},
        },
        code_hash: contractCodeHash,
      },
      { gasLimit: 100_000 }
    );

    console.log(tx);
  };
  // reset_net_worth();

  let query_2cards = async (myQuery) => {
    let query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      query: {
        get2_cards: {},
      },
      code_hash: contractCodeHash,
    });

    myQuery.push(query);

    console.log(myQuery);
  };

    let query_card = async (myQuery, index) => {
    let query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      query: {
        get_card: {idx: index},
      },
      code_hash: contractCodeHash,
    });

    myQuery.push(query);

    console.log(myQuery);
  };

  let query_win = async (myQuery, index) => {
    let query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      query: {
        check_win: {idx: index},
      },
      code_hash: contractCodeHash,
    });

    myQuery.push(query);

    console.log(myQuery);
  };

  let query_deck = async (myQuery) => {
    let query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      query: {
        get_deck: {},
      },
      code_hash: contractCodeHash,
    });

    myQuery.push(query);

    console.log(myQuery);
  };

  //   query_net_worth();
  return {
    submit_net_worth,
    create_deck,
    query_2cards,
    query_card,
    query_deck,
    query_win,
  };
};

export { SecretjsFunctions };
