// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
require("dotenv").config();

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

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "beep") {
    await interaction.reply("Boop!");
  } else if (commandName === "wack") {
    await interaction.reply("fuck");
  }
});

// Login to Discord with your client's token
client.login(TOKEN);
