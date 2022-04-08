// Require the necessary discord.js classes
import { Client, Intents } from "discord.js";
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
    await interaction.reply(JSON.stringify(wallets));
  } else if (commandName === "add") {
    const wallet = interaction.options.get("wallet");

    if (wallet) {
      db.data.wallets.push(wallet.value);
      await db.write();
      await interaction.reply("Wallet added!");
    } else {
      await interaction.reply(
        "There was an error while adding that wallet, sorry about that."
      );
    }
  }
});

// Login to Discord with your client's token
client.login(TOKEN);
