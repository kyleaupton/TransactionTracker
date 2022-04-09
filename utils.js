import { MessageEmbed } from "discord.js";

export const buildErrorResponse = ({ message = "", type = "error" } = {}) => {
  return new MessageEmbed().setColor("#ff0000").setTitle(message);
};
