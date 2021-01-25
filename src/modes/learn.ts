import { ArgsOf, Discord, On } from "@typeit/discord";
import { Client } from "discord.js";
import * as dotenv from "dotenv";
import { db, randomReplier } from "..";
import { Config } from "../config";

@Discord(Config.learn.command) // Decorate the class
// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class LearnMode {
  @On("message")
  private async onMessage(
    [message]: ArgsOf<"message">,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    client: Client,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    guardPayload: any
  ) {
    const env = dotenv.config();
    if (
      message.author.bot ||
      message.channel.id != env.parsed.LEARN_CHANNEL ||
      !message.content.startsWith(Config.learn.command)
    )
      return;
    if (message.content.includes(Config.learn.answer)) {
      const l = message.content
        .replace(Config.learn.command, "")
        .split(Config.learn.answer, 2);
      const ok = await db.newQuestion(l[0], l[1]);
      if (ok) message.reply("Pregunta añadida");
      else message.reply("Error añadiendo la pregunta");
    } else {
      const l = message.content.replace(Config.learn.command, "");
      if (await randomReplier.add(l))
        message.reply("Respuesta aleatoria añadida");
      else message.reply("Error añadiendo la respuesta");
    }
  }
}
