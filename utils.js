import { MessageEmbed } from "discord.js";

export const buildResponse = ({ message = "", type = "normal" } = {}) => {
  let color = "";
  if (type === "error") {
    color = "#ff0000";
  } else if (type === "warning") {
    color = "#eb7134";
  } else {
    color = "#0099ff";
  }

  return new MessageEmbed().setColor(color).setTitle(message);
};
