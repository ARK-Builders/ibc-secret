const secretjsimported = require("secretjs")
const fs = require('fs');
const dotenv = require("dotenv")
dotenv.config();



const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const PORT = 4000
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.use(cors())


const wallet = new secretjsimported.Wallet(process.env.MNEMONIC);


const secretjs = new secretjsimported.SecretNetworkClient({
  chainId: "pulsar-2",
  url: "https://api.pulsar.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

let codeId = 21905;
let contractCodeHash = "5d586d59629f06b981c16991c05bca187e68b4c5ac943006a361c9086f4bca45";
let contract_address = "secret1ue7pu8rpcsuv02pwacvesdhel5562l433ykqkd";

let deck = ["6", "6", "6", "6", "7", "7", "7", "7", "8", "8", "8", "8", "9", "9", "9", "9", "10", "10", "10", "10", "J", "J", "J", "J", "Q", "Q", "Q", "Q", "K", "K", "K", "K", "A", "A", "A", "A"];

let userDecks = new Map();


let try_query_count = async () => {
  const my_query = await secretjs.query.compute.queryContract({
    contract_address: contract_address,
    code_hash: contractCodeHash,
    query: { get_flip: {} },
  });

  return my_query;
};


let try_increment_count = async () => {
  try {
    let tx = await secretjs.tx.compute.executeContract(
      {
        sender: wallet.address,
        contract_address: contract_address,
        code_hash: contractCodeHash, // optional but way faster
        msg: {
          flip: {},
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


let createDeck = async (id) =>{
    let temp = [...deck];

    userDecks.set(id, [...deck]);
    for(let i = 0; i < 36; i++)
    {
      if(i == 1 || i == 2)
      {
        socketIO.to(id).emit('newCardsReveal', [userDecks.get(id)[i - 1]])
      }
      await try_increment_count();
      let rnd = await try_query_count();
      if(!userDecks.has(id))
        return;
      let randIndex = Math.floor(rnd.flip % temp.length);
      let tempDeck = [...userDecks.get(id)];
      tempDeck[i] = temp[randIndex];
      userDecks.set(id, [...tempDeck]);
      temp.splice(randIndex, 1);
    }

} ;

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)  

    createDeck(socket.id);

    console.log(userDecks);


    socket.on("oneMoreCard", data => {
      console.log(data);
      socketIO.to(socket.id).emit("newCardsReveal", [userDecks.get(socket.id)[data.cardPosition]])
    })


    socket.on("restartGame", data => {
      userDecks.delete(socket.id)
      createDeck(socket.id);
    })

    socket.on("getDeck", data => {
        console.log("sending deck");
      socketIO.to(socket.id).emit("sendDeck", userDecks.get(socket.id))
    })

 
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
      console.log(userDecks.delete(socket.id))
      socket.disconnect()
    });
});

app.get("/api", (req, res) => {
  res.json({message: "Hello"})
});

   
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});