import moment from "moment";
import {
  getTxCount,
  sendMessage,
  sendRequest,
  buildTransactionResonse,
  buildResponse,
} from "./utils.js";
import { db } from "./db.js";

let checking = false;

const doCheck = async (wallet, client) => {
  const n = await getTxCount({ wallet: wallet.wallet });

  if (n > wallet.txCount) {
    const delta = n - wallet.txCount;

    if (delta <= 10) {
      const response = await sendRequest({
        method: "GET",
        url: `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet.wallet}&page=1&offset=${delta}&sort=desc&apikey=${process.env.ETHERSCAN_API_TOKEN}`,
      });

      const newTxs = response.result.reverse();

      for (const tx of newTxs) {
        await sendMessage(client, {
          embeds: [buildTransactionResonse(tx, wallet)],
        });
      }
    } else {
      await sendMessage(client, {
        embeds: [
          buildResponse({
            message: `There are ${delta} new tx's in ${wallet.nickname}!`,
          }),
        ],
      });
    }

    const wallets = await db.data.wallets;
    const index = wallets.findIndex((x) => x.wallet === wallet.wallet);

    if (index > -1) {
      db.data.wallets[index].txCount = n;
      await db.write();
    }
  }
};

const check = async (client) => {
  console.log("checking...");
  if (!checking) {
    checking = true;
    const wallets = await db.data.wallets;

    await Promise.all(
      wallets.map((wallet) => {
        return doCheck(wallet, client);
      })
    );

    checking = false;
  }
};

export const startChecker = (client) => {
  check(client);

  setInterval(() => {
    check(client);
  }, 10000);
  //   }, 120000); // Check's every two minutes
};
