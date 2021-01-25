import { IQuestion, Question } from "../models/question";
import { parseMsg } from "../parser";

export default class QAController {
  static async newQuestion(q: string, a: string): Promise<string> {
    const data = await Question.create({ question: q, answer: a });
    if (data.errors) return data.errors.message;
    else return null;
  }
  static async ask(q: string): Promise<string> {
    const question = await Question.where("question")
      .equals(await parseMsg(q))
      .exec();
    let ans: string = null;
    question.forEach((i: IQuestion) => {
      ans = i.answer;
    });
    return ans;
  }
  static async searchSimilars(question: string): Promise<IQuestion[]> {
    const questions = await Question.where("question")
      .equals(await parseMsg(question))
      .exec();
    const r: IQuestion[] = [];
    questions.forEach((q) => {
      if (q != null) r.push(q as IQuestion);
    });
    return r;
  }
  static async deleteById(...ids: string[]): Promise<void> {
    ids.forEach(async (id: string) => {
      await Question.findByIdAndRemove(id).exec();
    });
  }
}
