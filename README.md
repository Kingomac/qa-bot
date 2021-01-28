# Q&A Discord Bot

This is a Discord Bot that answer questions stores in a MongoDB database. It's made with [discord.ts](https://github.com/OwenCalvin/discord.ts), a extension of [discord.js](https://github.com/discordjs/discord.js/).

# Requirements

- [Nodejs](https://nodejs.org/es/). Tested with Nodejs 12.20.1.
- [MongoDB Server](https://www.mongodb.com/try/download/community)
- [MongoDB Database Tools](https://www.mongodb.com/try/download/database-tools) for the backups.

# Configuration

Run `npm i` to install the needed modules. Then create a `.env` file in the root directory following this example:

```
BOT_TOKEN=(discord bot token)
REPLY_CHANNEL=(id for the reply channel)
LEARN_CHANNEL=(id of the learn channel)
DB_HOST=localhost
DB_PORT=27017
DB_NAME=(db name)
MONGODUMP=(path to mongodump.exe from MongoDB Tools. If it's in PATH just write mongodump)
BACKUP_LOCATION=(path to backup location)
MUSIC_LOCATION=(path to a folder to play music from)
MODE=testing (shows channel id in every message)/development/production
```

Run the MongoDB database server, link the bot with the discord server and run the bot with `npx tsc; npm start`.

# Commands

For LEARN_CHANNEL:

- `y-l:(random answer)`: adds a random answer that the bot will send when there isn't an answer to a question.
- `y-l:(question)::answer`: adds an answer to a question.
- `y-qa:buscar:(question)`: searchs the \_id and answer of a question.
- `y-qa:borrar:(_id)`: deletes a question by an \_id given.
- `y-r:lista`: prints a list of the random answers.
- `y-r:borrar:(random answer)`: deletes a random answer without writing the \_id.
- `y:borrar`: only for members with the role ADMIN. Deletes every message in the channel (works in every channel).
- `y:guardar`: creates a backup

Music commands:

- `y-m`: play local music in order.
- `y-m:aleatorio`: play local music in random order.
- `y-m:(youtube link)`: play Youtube video or playlist in order.
- `y-m:aleatorio:(youtube link)`: play Youtube playlist in random order.
- `y-m:siguiente`: play the next song or random song.
- `y-m:anterior`: play previous song.
- `y-m:pausa`: pause song.
- `y-m:reanudar`: resume song.
- `y-m:detener`: stop song and leave voice chat.
