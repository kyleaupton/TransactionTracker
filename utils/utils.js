import { MessageEmbed } from "discord.js";
import got from "got";
import Web3 from "web3";
import { db } from "./db.js";

export const getTxCount = async ({ wallet } = {}) => {
  if (wallet) {
    const web3Http = new Web3(process.env.INFURA_URL);
    return web3Http.eth.getTransactionCount(wallet);
  }
};

export const buildResponse = ({
  message = "",
  type = "normal",
  genaricError = false,
} = {}) => {
  let color = "";
  if (type === "error") {
    color = "#ff0000";
  } else if (type === "warning") {
    color = "#eb7134";
  } else {
    color = "#0099ff";
  }

  const text = genaricError ? "An unknown error has occured." : message;

  return new MessageEmbed().setColor(color).setTitle(text);
};

export const buildTransactionResonse = (tx, wallet) => {
  return new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`${wallet.nickname}: New Transaction`)
    .setURL(`https://etherscan.io/tx/${tx.hash}`)
    .setThumbnail(
      "https://cdn-images-1.medium.com/max/1200/1*YbebeYsXS_N0LRcTkHT_IA.png"
    )
    .addFields(
      {
        name: "Timestamp",
        value: `<t:${tx.timeStamp}:F> // <t:${tx.timeStamp}:R>`,
      },
      { name: "Transaction Hash", value: tx.hash },
      {
        name: "From",
        value: tx.from === wallet.wallet ? wallet.nickname : tx.from,
      },
      {
        name: "To",
        value: tx.to === wallet.wallet ? wallet.nickname : tx.to,
      },
      { name: "Value", value: `${Number(tx.value) / Math.pow(10, 18)} ETH` },
      {
        name: "Gas",
        value: `${(Number(tx.gasPrice) / Math.pow(10, 9)).toFixed(2)} GWEI`,
      }
    )
    .setFooter({
      text: "Bao Finance",
      iconURL:
        "https://cdn-images-1.medium.com/max/1200/1*YbebeYsXS_N0LRcTkHT_IA.png",
    });
};

export const sendMessage = async (client, param) => {
  console.log("sending message!");
  const targetId = await db.data.targetChannel;
  const channel = client.channels.cache.get(targetId);

  if (channel) {
    channel.send(param);
  }
};

export const sendRequest = ({ url, method }) => {
  if (method === "GET") {
    return got.get(url).json();
  } else if (method === "POST") {
    return got.post(url).json();
  }
};
