import { ArgsOf, Discord, On } from "@typeit/discord";
import { Client } from "discord.js";
import * as dotenv from "dotenv";
import { db } from "..";
import { Config } from "../config";

@Discord("$") // Decorate the class
abstract class LearnMode {
  @On("message")
  private async onMessage(
    [message]: ArgsOf<"message">,
    client: Client,
    guardPayload: any
  ) {
    const env = dotenv.config();
    if (
      message.author.bot ||
      message.channel.id != env.parsed.LEARN_CHANNEL ||
      message.content.startsWith(Config.command)
    )
      return;
    if (
      !message.content.startsWith(Config.qa.question) ||
      !message.content.includes(Config.qa.answer)
    ) {
      message.reply("$pregunta::respuesta");
      return;
    }
    const l = message.content
      .replace(Config.qa.question, "")
      .split(Config.qa.answer, 2);
    const ok = await db.newQuestion(l[0], l[1]);
    if (ok) message.reply("Pregunta añadida");
    else message.reply("Error añadiendo la pregunta");
  }
}
