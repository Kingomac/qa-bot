import * as mongoose from 'mongoose';
import { IQuestion, Question } from './models/question'
import { parseMsg } from './parser';

export class DatabaseConnection {
    db: mongoose.Connection;
    constructor(url: string) {
        mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true, dbName: 'waifu-bot' });
        this.db = mongoose.connection;
        this.db.on('error', () => {
            throw "Database connection error";
        })
        this.db.once('open', () => {
            console.log("Database connected successfully");
        })
    }
    async newQuestion(q:string, a: string): Promise<boolean> {
        const data = await Question.create({ question: q, answer: a });
        if(data.errors)
            return false;
        else
            return true;
    }
    async ask(q: string): Promise<string> {
        const question = await Question.where('question').equals(await parseMsg(q)).exec();
        let ans = "No c";
        question.forEach((i:IQuestion) => {
            ans = i.answer;
        });
        return ans;
    }
    async close(): Promise<void> {
        await this.db.close();
    }
}
