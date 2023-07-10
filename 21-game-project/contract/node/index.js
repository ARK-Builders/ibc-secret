const secretjsimported = require("secretjs")
const fs = require('fs');
const dotenv = require("dotenv")
dotenv.config();

const wallet = new secretjsimported.Wallet(process.env.MNEMONIC);

const contract_wasm = fs.readFileSync("../contract.wasm.gz");

const secretjs = new secretjsimported.SecretNetworkClient({
  chainId: "pulsar-2",
  url: "https://api.pulsar.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

/*
let upload_contract = async () => {
  let tx = await secretjs.tx.compute.storeCode(
    {
      sender: wallet.address,
      wasm_byte_code: contract_wasm,
      source: "",
      builder: "",
    },
    {
      gasLimit: 4_000_000,
    }
  );

  const codeId = Number(
    tx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
      .value
  );

  console.log("codeId: ", codeId);

  const contractCodeHash = (
    await secretjs.query.compute.codeHashByCodeId({ code_id: codeId })
  ).code_hash;
  console.log(`Contract hash: ${contractCodeHash}`);
  
};

upload_contract();
*/

let codeId = 22345;
let contractCodeHash = "e2f9f21300d512f013610dd73cbd965a8a7620a49b558f42038f153719eac2d0";
let contract_address = "secret185znckt6tayjpj02svchxjd0ycxj6xuyqj68gu";


let instantiate_contract = async () => {
  try {
  // Create an instance of the Counter contract, providing a starting count
  const initMsg = { deck: [5, 6, 7, 8, 6] };
  let tx = await secretjs.tx.compute.instantiateContract(
    {
      code_id: codeId,
      sender: wallet.address,
      code_hash: contractCodeHash,
      init_msg: initMsg,
      label: "secret-rnd-" + Math.ceil(Math.random() * 10000)
    },
    {
      gasLimit: 400_000,
    }
  );
  //Find the contract_address in the logs
  const contractAddress = tx.arrayLog.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;

  console.log(contractAddress);
  } catch (error) {
  console.error(error);
    }
};

instantiate_contract();


let try_query_count = async () => {
  try {
  const my_query = await secretjs.query.compute.queryContract({
    contract_address: contract_address,
    code_hash: contractCodeHash,
    query: { get_deck: {} },
  });

  console.log(my_query);
  return my_query;
  } catch (error) {
  console.error(error);
    }
};

try_query_count();



let try_increment_count = async () => {
  try {
    let tx = await secretjs.tx.compute.executeContract(
      {
        sender: wallet.address,
        contract_address: contract_address,
        code_hash: contractCodeHash, // optional but way faster
        msg: {
          deck: {},
        }
      },
      {
        gasLimit: 100_000,
      }
    );
    console.log("fliping...");
    } catch (error) {
  console.error(error);
    }
};


let deck = ["6", "6", "6", "6", "7", "7", "7", "7", "8", "8", "8", "8", "9", "9", "9", "9", "10", "10", "10", "10", "J", "J", "J", "J", "Q", "Q", "Q", "Q", "K", "K", "K", "K", "A", "A", "A", "A"];




let temp = [...deck];

/*
let create_Deck = async () => {
  for(let i = 0; i < 36; i++)
    {
      await try_increment_count();
      let smth = await try_query_count();
      let randIndex = Math.floor(smth.flip % temp.length);
      deck[i] = temp[randIndex];
      temp.splice(randIndex, 1);
      console.log(deck);
    }
}

create_Deck();

console.log(deck);
*/