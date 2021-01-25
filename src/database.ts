import * as mongoose from "mongoose";
import { IQuestion, Question } from "./models/question";
import { parseMsg } from "./parser";
import { createNanoEvents, Emitter, Unsubscribe } from "nanoevents";

interface DatabaseEvents {
  ready: () => Promise<void>;
  closing: () => Promise<void>;
}

export class DatabaseConnection {
  emitter: Emitter;
  db: mongoose.Connection;
  constructor(url: string) {
    this.emitter = createNanoEvents<DatabaseEvents>();
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "waifu-bot",
    });
    this.db = mongoose.connection;
    this.db.on("error", () => {
      throw "Database connection error";
    });
    this.db.once("open", () => {
      console.log("Database connected successfully");
      this.emitter.emit("ready");
    });
  }
  on<E extends keyof DatabaseEvents>(
    event: E,
    callback: DatabaseEvents[E]
  ): Unsubscribe {
    return this.emitter.on(event, callback);
  }
  async newQuestion(q: string, a: string): Promise<boolean> {
    const data = await Question.create({ question: q, answer: a });
    if (data.errors) return false;
    else return true;
  }
  async ask(q: string): Promise<string> {
    const question = await Question.where("question")
      .equals(await parseMsg(q))
      .exec();
    let ans: string = null;
    question.forEach((i: IQuestion) => {
      ans = i.answer;
    });
    return ans;
  }
  async searchSimilars(question: string): Promise<IQuestion[]> {
    const questions = await Question.where("question")
      .equals(await parseMsg(question))
      .exec();
    const r: IQuestion[] = [];
    questions.forEach((q) => {
      if (q != null) r.push(q as IQuestion);
    });
    return r;
  }
  async deleteById(...ids: string[]): Promise<void> {
    ids.forEach(async (id: string) => {
      await Question.findByIdAndDelete(id);
    });
  }
  async close(): Promise<void> {
    this.emitter.emit("closing");
    await this.db.close();
  }
}
