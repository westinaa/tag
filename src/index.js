const { Client, IntentsBitField, Partials } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');
const { joinVoiceChannel } = require("@discordjs/voice");

const config = require('./config.js');

const express = require('express');
const app = express();
const PORT = 4000;

// Mini web server — uptime için
app.get('/', (req, res) => {
  res.send('https://discord.gg/izlerkalirsin');
});

app.listen(PORT, () => {
  console.log(`Web sunucusu ${PORT} portunda çalışıyor.`);
});

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
    partials: [
        Partials.User,
    ],
});

const listenersPath = path.join(__dirname, './listeners');
const listenersFiles = fs.readdirSync(listenersPath).filter(file => file.endsWith('.js'));

for (const file of listenersFiles) {
    const filePath = path.join(listenersPath, file);
    /**
     * @interface @type {{ name: keyof import('discord.js').ClientEvents; once: boolean; run: (...args: any) => void | Promise<void> }}
     */
    const listener = require(filePath);

    if ('name' in listener && 'run' in listener) {
        client[ listener.once ? 'once' : 'on' ](listener.name, (...args) => { listener.run(...args); });
    }
}

client.once("ready", () => {

console.log(`Online: ${client.user.tag}`);

  client.user.setPresence({
    activities: [{ name: "@izlerkalirsin", type: "LISTENING" }],
    status: 'online',
  });
    
   /*  // Ses kanalına bağlanma
    const botVoiceChannel = client.channels.cache.get("1357154558870163647");
    if (!botVoiceChannel) {
      return console.error("[HATA] Ses kanalı bulunamadı!");
    }
  
    try {
      const connection = joinVoiceChannel({
        channelId: botVoiceChannel.id,
        guildId: botVoiceChannel.guild.id,
        adapterCreator: botVoiceChannel.guild.voiceAdapterCreator,
      });
  
      console.log("Bot ses kanalına bağlandı!");
    } catch (err) {
      console.error("[HATA] Bot ses kanalına bağlanamadı!", err);
    }*/
  });

client.login(config.discord.token)
    .then(() => {
        console.log('[LOGIN] Discord API\'ye istek gönderimi başarılı.');
    })
    .catch(() => {
        console.log('[LOGIN] Discord API\'ye istek gönderimi başarısız.');
    });
