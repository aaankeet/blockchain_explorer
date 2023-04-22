const express = require('express');
const app = express();
const port = 5001;
const Moralis = require('moralis').default;
const cors = require('cors');

require('dotenv').config({ path: '.env' });

app.use(cors());
app.use(express.json());
const MORALIS_API_KEY = process.env.MORALIS_API;

// Getting Eth Price
app.get('/getEthPrice', async (req, res) => {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      chain: '0x1',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    });
    return res.status(200).json(response);
  } catch (error) {
    console.log(`Failed To Get Eth Price`);
    return res.status(400).json();
  }
});

// Getting Block Data
app.get('getBlockData', async (req, res) => {
  try {
    const latestBlock = await Moralis.EvmApi.block.getDateToBlock({
      chain: '0x1',
      date: Date.now(),
    });
    let blockNoOrParentHash = latestBlock.toJSON().block;
    let previousBlockInfo = [];

    for (let i = 0; i < 5; i++) {
      const previousBlock = await Moralis.EvmApi.block.getBlock({
        chain: '0x1',
        blockNumberOrHash: blockNoOrParentHash,
      });

      blockNoOrParentHash = previousBlock.toJSON().parent_hash;

      if (i == 0) {
        previousBlockInfo.push({
          transactions: previousBlockInfo.toJSON().transactions.map((i) => {
            return {
              transcationHash: i.hash,
              time: i.block_timestamp,
              from: i.from_Address,
              to: i.to_Address,
              value: i.value,
            };
          }),
        });
      }
      previousBlockInfo.push({
        blockNumber: previousBlock.toJSON().number,
        totalTransactions: previousBlock.toJSON().transaction_count,
        gasUsed: previousBlock.toJSON().gas_used,
        miner: previousBlock.toJSON().miner,
        time: previousBlock.toJSON().timestamp,
      });
    }
    const response = {
      latestBlock: latestBlock.toJSON().block,
      previousBlockInfo,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log(`Failed To Get Block Data ${error}`);
    return res.status(400).json();
  }
});

// Getting Transaction Details of an Address
app.get('/addressData', async (req, res) => {
  try {
    const { query } = req;

    const response =
      await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
        chain: '0x1',
        address: query.address,
      });
    return res.status(200).json(response);
  } catch (error) {
    console.log(`Failed To Get Transaction Data ${error}`);
    return res.status(400).json();
  }
});

Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening to API Calls`);
  });
});
