import { useContext } from "react";
import { MsgExecuteContract } from "secretjs";
import { SecretjsContext } from "./SecretjsContext";

let contractCodeHash =
  "49d13faf7812c11efa07a131303725b7c78a045e8895f40519a5b3ad3ec4de21";
let contractAddress = "secret1az0h2gg0f3mwu00hgyksnqkxnv36zyszczvvlk";

const SecretjsFunctions = () => {
  const { secretjs, secretAddress } = useContext(SecretjsContext);


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

    let increment = async () => {
    const tx = await secretjs.tx.compute.executeContract(
      {
        sender: secretAddress,
        contract_address: contractAddress,
        msg: {
          increment: {},
        },
        code_hash: contractCodeHash,
      },
      { gasLimit: 100_000 }
    );

    console.log(tx);
  };

  let enough_cards = async () => {
    const tx = await secretjs.tx.compute.executeContract(
      {
        sender: secretAddress,
        contract_address: contractAddress,
        msg: {
          enough: {},
        },
        code_hash: contractCodeHash,
      },
      { gasLimit: 100_000 }
    );

    console.log(tx);
  };


  let query_2cards = async (myQuery, wallet) => {
    let query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      query: {
        get2_cards: {wallet: wallet},
      },
      code_hash: contractCodeHash,
    });

    myQuery.push(query);

    console.log(myQuery);
  };

    let query_card = async (myQuery, wallet) => {
    let query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      query: {
        get_card: {wallet: wallet},
      },
      code_hash: contractCodeHash,
    });

    myQuery.push(query);

    console.log(myQuery);
  };

  let query_win = async (myQuery, wallet) => {
    let query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      query: {
        check_win: {wallet: wallet},
      },
      code_hash: contractCodeHash,
    });

    myQuery.push(query);

    console.log(myQuery);
  };

  let query_deck = async (myQuery, wallet) => {
    let query = await secretjs.query.compute.queryContract({
      contract_address: contractAddress,
      query: {
        get_deck: {wallet: wallet},
      },
      code_hash: contractCodeHash,
    });

    myQuery.push(query);

    console.log(myQuery);
  };

  //   query_net_worth();
  return {
    create_deck,
    increment,
    enough_cards,
    query_2cards,
    query_card,
    query_deck,
    query_win,
  };
};

export { SecretjsFunctions };
