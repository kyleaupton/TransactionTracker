import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { ChannelType, Routes } from "discord-api-types/v9";

import "dotenv/config";
const { TOKEN, CLIENTID, GUILDID } = process.env;

const commands = [
  {
    name: "list",
    description: "List the currently tracked wallets.",
  },
  {
    name: "add",
    description: "Add wallet to be tracked.",
    stringOptions: [
      {
        name: "nickname",
        description: "friendly name to represent the wallet",
      },
      {
        name: "wallet",
        description: "wallet to be tracked",
      },
    ],
  },
  {
    name: "remove",
    description: "Remove wallet from list of wallets being tracked",
  },
  {
    name: "set-channel",
    description: "Set the text channel that tx's get send to",
    channelOptions: [
      {
        name: "text-channel",
        description: "target text channel",
        type: ChannelType.GuildText,
      },
    ],
  },
];

const processedCommands = commands.map((command) => {
  const item = new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description);

  if (
    Object.keys(command).find((key) => key === "stringOptions") &&
    Array.isArray(command.stringOptions)
  ) {
    command.stringOptions.forEach((option) => {
      item.addStringOption((o) =>
        o
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(true)
      );
    });
  }

  if (
    Object.keys(command).find((key) => key === "channelOptions") &&
    Array.isArray(command.channelOptions)
  ) {
    command.channelOptions.forEach((option) => {
      item.addChannelOption((o) =>
        o
          .setName(option.name)
          .setDescription(option.description)
          .addChannelType(option.type)
          .setRequired(true)
      );
    });
  }

  return item.toJSON();
});

const rest = new REST({ version: "9" }).setToken(TOKEN);

rest
  .put(Routes.applicationGuildCommands(CLIENTID, GUILDID), {
    body: processedCommands,
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
