import { Command, CommandMessage, Discord } from "@typeit/discord";
import { Collection, Message } from "discord.js";
import { Config } from "../config";
import { BackupResponse, Backup } from "../backup";

@Discord(Config.general.command) // Decorate the class
// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class GeneralCommands {
  @Command(Config.general.commands.delete)
  private async deleteChannelMessages(message: CommandMessage) {
    if (message.member.roles.cache.find((r) => r.name == "ADMIN")) {
      let messages: Collection<string, Message>;
      do {
        messages = await message.channel.messages.fetch({ limit: 100 });
        message.channel.messages.channel.bulkDelete(messages);
      } while (messages.size >= 2);
    }
  }
  @Command(Config.general.commands.backup)
  private async createBackup(message: CommandMessage) {
    const b: BackupResponse = await Backup.create();
    message.channel.send(b.message, { files: [b.path] });
  }
}
