// Require the necessary discord.js classes
import { Client, Intents, MessageEmbed } from "discord.js";
import "dotenv/config";
import { buildResponse } from "./utils.js";
import { db } from "./db.js";
import { MessageActionRow, MessageSelectMenu } from "discord.js";

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
      await interaction.reply({
        embeds: [
          buildResponse({
            message: "No wallets currently being tracked.",
          }),
        ],
      });
    }
  } else if (commandName === "add") {
    const wallet = interaction.options.get("wallet");
    const nickname = interaction.options.get("nickname");

    if (wallet && nickname) {
      db.data.wallets.push({ wallet: wallet.value, nickname: nickname.value });
      await db.write();
      await interaction.reply({
        embeds: [buildResponse({ message: "Wallet added!" })],
      });
    } else {
      await interaction.reply({
        embeds: [
          buildResponse({
            type: "error",
            message: "Please supply all the required options.",
          }),
        ],
      });
    }
  } else if (commandName === "remove") {
    const wallets = await db.data.wallets;

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("targetWallet")
        .setPlaceholder("Choose a wallet to delete:")
        .addOptions(
          wallets.map((item) => {
            return {
              label: item.nickname,
              description: item.wallet,
              value: item.wallet,
            };
          })
        )
    );

    await interaction.reply({
      components: [row],
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isSelectMenu()) return;

  if (interaction.customId === "targetWallet") {
    const targetString = interaction.values[0];

    if (targetString) {
      const wallets = await db.data.wallets;
      const targetIndex = wallets.findIndex((x) => x.wallet === targetString);

      if (targetIndex > -1) {
        const removedWallet = wallets[targetIndex];
        db.data.wallets.splice(targetIndex, 1);
        await db.write();

        await interaction.update({
          embeds: [
            buildResponse({
              message: `${removedWallet.nickname} was successfully removed!`,
            }),
          ],
          components: [],
        });
      } else {
        await interaction.update({
          embeds: [
            buildResponse({
              message: "Could not find selected wallet.",
              type: "error",
            }),
          ],
          components: [],
        });
      }
    } else {
      await interaction.update({
        embeds: [
          buildResponse({
            message: "An unknown error has occured.",
            type: "error",
          }),
        ],
        components: [],
      });
    }
  }
});

// Login to Discord with your client's token
client.login(TOKEN);
