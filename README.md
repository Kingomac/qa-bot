# Q&A Discord Bot

This is a Discord Bot that answer questions stores in a MongoDB database. It's made with [discord.ts](https://github.com/OwenCalvin/discord.ts), a extension of [discord.js](https://github.com/discordjs/discord.js/).

# Usage

Run `npm i` to install the needed modules. Then create a `.env` file in the root directory following this example:

```
BOT_TOKEN=discordToken
REPPLY_CHANNEL=id // Channel id for the bot to repply
LEARN_CHANNEL=id // Channel id for the bot to accept requests
DB_URL=mongodb://localhost:27017/
```

Run the MongoDB database, link the bot with the discord server and run the bot with `npx tsc; npm start`
