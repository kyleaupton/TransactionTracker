// Require the necessary discord.js classes
import { Client, Intents, MessageEmbed } from "discord.js";
import "dotenv/config";
import { buildErrorResponse } from "./utils.js";
import { db } from "./db.js";

const { TOKEN } = process.env;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "list") {
    const wallets = await db.data.wallets;

    if (wallets.length) {
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Wallets")
        .addFields(
          wallets.map((wallet) => {
            return { name: wallet.nickname, value: wallet.wallet };
          })
        );
      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply("No wallets added.");
    }
  } else if (commandName === "add") {
    const wallet = interaction.options.get("wallet");
    const nickname = interaction.options.get("nickname");

    if (wallet && nickname) {
      db.data.wallets.push({ wallet: wallet.value, nickname: nickname.value });
      await db.write();
      await interaction.reply("Wallet added!");
    } else {
      await interaction.reply({
        embeds: [
          buildErrorResponse({
            message: "Please supply all the required options.",
          }),
        ],
      });
    }
  } else if (commandName === "remove") {
    const { value } = interaction.options.get("wallet");

    if (value) {
      const index = db.data.wallets.findIndex((item) => item === value);
      if (index > -1) {
        db.data.wallets.splice(index, 1);
        await db.write();
        await interaction.reply("Wallet removed");
      } else {
        await interaction.reply(
          "Wallet was not found. Please try again with a different string."
        );
      }
    } else {
      await interaction.reply("There was an error while removing the wallet.");
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isSelectMenu()) return;

  console.log(interaction);
});

// Login to Discord with your client's token
client.login(TOKEN);

/**
 * 
 * [
 *   {
 *      wallet: '',
 *      nickname: 'Kyle's wallet',
 *   }
 * ]
 * 
 * const newArray = oldArray.map((element) => {
 *    return {
							label: 'Select me',
							description: 'A wallet',
							value: 'first_option',
						}
 * });
 */
