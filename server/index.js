const cors = require('cors');
const express = require('express');
const { ethers } = require('ethers');

require('dotenv').config();

const INFURA_API_KEY = process.env.INFURA_ENDPOINT;
const app = express();
const PORT = 3042;
const provider = new ethers.providers.JsonRpcProvider(INFURA_API_KEY);

let currentBlock;

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: `Hello World!` });
});

app.get("/poll", async (req, res) => {
    // use ethers to poll rinkeby for new blocks, return new block data to front-end
    let newBlock = await provider.getBlock();
    res.json({ block: newBlock });
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});