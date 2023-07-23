const secretjsimported = require("secretjs")
const fs = require('fs');
const dotenv = require("dotenv")
dotenv.config();

const wallet = new secretjsimported.Wallet(process.env.MNEMONIC);

const contract_wasm = fs.readFileSync("../contract.wasm.gz");

const secretjs = new secretjsimported.SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});


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

// upload_contract();


let codeId = 39;
let contractCodeHash = "4ce7fed73b4460cc57351c43f582eccdada65a137587fe606e3f260b81c70a71";
let contract_address = "secret1wppm2l27vpkaxmuyym6ag6w7f3qqhrrpeypqhm";


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

// instantiate_contract();


let try_query = async () => {
  try {
  const my_query = await secretjs.query.compute.queryContract({
    contract_address: contract_address,
    code_hash: contractCodeHash,
    query: { get_deck: {wallet: "secret1grgcderf32vn8zpcy3fu3k96cxaffynrncyjf6"} },
  });

  await console.log(my_query);
  return my_query;
  } catch (error) {
  console.error(error);
    }
};

 try_query();



let build_deck = async () => {
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
    await console.log("deck_built...");
    } catch (error) {
  console.error(error);
    }
};


// build_deck();