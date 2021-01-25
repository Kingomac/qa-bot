import { ArgsOf, Discord, On } from "@typeit/discord";
import { Client } from "discord.js";
import { Config } from "../config";
import { randomReplier } from "../index";
import * as dotenv from "dotenv";

@Discord(Config.rand.command) // Decorate the class
// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class CommandMode {
  @On("message")
  private async onMessage(
    [message]: ArgsOf<"message">,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    client: Client,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    guardPayload: any
  ) {
    const env = dotenv.config();
    if (message.author.bot || message.channel.id != env.parsed.LEARN_CHANNEL)
      return;

    const l = message.content.replace(Config.rand.command, "");
    if (l.startsWith(Config.rand.commands.delete)) {
      const ll = l.replace(Config.rand.commands.delete, "");
      if (await randomReplier.delete(ll)) message.reply(`${l} borrado`);
      else message.reply(`Error borrando ${ll}`);
    } else if (l == Config.rand.commands.list) {
      randomReplier.replies.forEach((i) => {
        setTimeout(() => {
          message.channel.send(i);
        }, 200);
      });
    }
  }
}
