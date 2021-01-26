import { ArgsOf, Discord, On } from "@typeit/discord";
import { Client, Collection, Message } from "discord.js";
import { Config } from "../config";
import Backup from "../backup";

@Discord(Config.general.command) // Decorate the class
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
    if (message.author.bot) return;
    const l = message.content.replace(Config.general.command, "");

    if (
      l == Config.general.commands.delete &&
      message.member.roles.cache.find((r) => r.name == "ADMIN")
    ) {
      let messages: Collection<string, Message>;
      do {
        messages = await message.channel.messages.fetch({ limit: 100 });
        message.channel.messages.channel.bulkDelete(messages);
      } while (messages.size >= 2);
    } else if (l == Config.general.commands.backup) {
      message.channel.send(await Backup.create());
    }
  }
}
