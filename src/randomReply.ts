import { IRandom, Random } from "./models/random";

export class RandomReply {
  replies: string[] = [];
  async initialize(): Promise<void> {
    const r = await Random.find({}).exec();
    r.forEach((i: IRandom) => {
      this.replies.push(i.message);
    });
  }
  async get(): Promise<string> {
    return this.replies[Math.floor(Math.random() * this.replies.length)];
  }
  async add(a: string): Promise<string> {
    const data = await Random.create({ message: a });
    if (data.errors) return data.errors.message;
    else return null;
  }
  async delete(a: string): Promise<boolean> {
    const index = this.replies.indexOf(a);
    if (index == -1) return false;
    await Random.deleteOne({ message: a }).exec();
    this.replies = this.replies.splice(this.replies.indexOf(a), 1);
    return true;
  }
}
