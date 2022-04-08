import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

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
    option: {
      name: "wallet",
      description: "wallet to be tracked",
      functionName: "addStringOption",
    },
  },
];

const processedCommands = commands.map((command) => {
  const item = new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description);

  if (Object.keys(command).find((key) => key === "option")) {
    item[command.option.functionName]((option) =>
      option
        .setName(command.option.name)
        .setDescription(command.option.description)
    );
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
