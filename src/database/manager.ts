import * as mongoose from "mongoose";
import { createNanoEvents, Emitter, Unsubscribe } from "nanoevents";

interface DatabaseEvents {
  ready: () => Promise<void>;
  closing: () => Promise<void>;
  error: (err: string) => Promise<void>;
}

export class DatabaseManager {
  emitter: Emitter;
  db: mongoose.Connection;
  constructor(host: string, port: number, dbName: string) {
    this.emitter = createNanoEvents<DatabaseEvents>();
    mongoose.connect(`mongodb://${host}:${port}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName,
    });
    this.db = mongoose.connection;
    this.db.on("error", (err) => {
      this.emitter.emit("error", err);
      console.log("Database connection error");
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
  async close(): Promise<void> {
    this.emitter.emit("closing");
    await this.db.close();
  }
}
