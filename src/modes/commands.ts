import { ArgsOf, Discord, On } from "@typeit/discord";
import { Client, Collection, Message } from "discord.js";
import * as dotenv from "dotenv";
import { db } from "..";
import { Config } from "../config";

@Discord("y:") // Decorate the class
abstract class CommandMode {
  @On("message")
  private async onMessage(
    [message]: ArgsOf<"message">,
    client: Client,
    guardPayload: any
  ) {
    const env = dotenv.config();
    if (message.author.bot) return;
    const l = message.content.replace(Config.command, "");
    if (l == Config.commands.delete) {
      let messages: Collection<string, Message>;
      do {
        messages = await message.channel.messages.fetch({ limit: 100 });
        message.channel.messages.channel.bulkDelete(messages);
      } while (messages.size >= 2);
    }
  }
}
