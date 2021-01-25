import { ArgsOf, Discord, On } from "@typeit/discord";
import { Client } from "discord.js";
import * as dotenv from "dotenv";
import { randController } from "..";
import QAController from "../database/QAController";
import { Config } from "../config";

@Discord() // Decorate the class
// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class ReplyMode {
  @On("message")
  private async onMessage(
    [message]: ArgsOf<"message">,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    client: Client,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    guardPayload: any
  ) {
    const env = dotenv.config();
    if (env.parsed.MODE == "testing" && !message.author.bot)
      message.channel.send(`Channel id: ${message.channel.id}`);
    if (
      message.author.bot ||
      message.channel.id != env.parsed.REPPLY_CHANNEL ||
      message.content.startsWith(Config.general.command)
    )
      return;
    const m = await QAController.ask(message.content);
    message.reply(m || (await randController.get()));
  }
}
