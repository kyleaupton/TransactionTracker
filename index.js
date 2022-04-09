// Require the necessary discord.js classes
import { Client, Intents, MessageEmbed } from "discord.js";
import "dotenv/config";
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
      let s = "";
      wallets.forEach((wallet, index) => {
        s += `${index + 1}. ${wallet}${index < wallets.length - 1 ? "\n" : ""}`;
      });
      const embed = new MessageEmbed().setTitle("Wallets").setDescription(s);
      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply("No wallets added.");
    }
  } else if (commandName === "add") {
    const wallet = interaction.options.get("wallet");

    if (wallet) {
      db.data.wallets.push(wallet.value);
      await db.write();
      await interaction.reply("Wallet added!");
    } else {
      await interaction.reply("There was an error while adding the wallet.");
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

// Login to Discord with your client's token
client.login(TOKEN);
