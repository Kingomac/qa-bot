import { ArgsOf, Discord, On } from "@typeit/discord";
import { Client } from "discord.js";
import * as dotenv from "dotenv";
import { db } from "..";

@Discord() // Decorate the class
abstract class LearnMode {
  @On("message")
  private async onMessage(
    [message]: ArgsOf<"message">,
    client: Client,
    guardPayload: any
  ) {
    const env = dotenv.config();
    if (message.author.bot || message.channel.id != env.parsed.LEARN_CHANNEL)
      return;
    if(!message.content.startsWith('$') || !message.content.includes('::')) {
        message.reply("$pregunta::respuesta");
        return;
    }
    const l = message.content.replace("$",'').split('::',2);
    const ok = await db.newQuestion(l[0], l[1]);
    if(ok)
        message.reply("Pregunta añadida");
    else
        message.reply("Error añadiendo la pregunta");
  }
}
