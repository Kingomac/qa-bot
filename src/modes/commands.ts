import { ArgsOf, Discord, On } from "@typeit/discord";
import { Client, Collection, Message } from "discord.js";
import { Config } from "../config";
import { IQuestion } from "../models/question";
import { db } from "../index";

@Discord("y:") // Decorate the class
abstract class CommandMode {
  @On("message")
  private async onMessage(
    [message]: ArgsOf<"message">,
    client: Client,
    guardPayload: any
  ) {
    if (message.author.bot) return;
    const l = message.content.replace(Config.command, "");

    if (l == Config.commands.delete) {
      let messages: Collection<string, Message>;
      do {
        messages = await message.channel.messages.fetch({ limit: 100 });
        message.channel.messages.channel.bulkDelete(messages);
      } while (messages.size >= 2);
    } else if (l.startsWith(Config.commands.search)) {
      const questions: IQuestion[] = await db.searchSimilars(
        l.replace(Config.commands.search, "")
      );
      questions.forEach(async (q) => {
        await message.channel.send(
          `_id:${q._id} / question:${q.question} / answer:${q.answer}`
        );
      });
    } else if (l.startsWith(Config.commands.deleteId)) {
      await db.deleteById(l.replace(Config.commands.deleteId, ""));
    }
  }
}
