const { ChannelType, ActivityType, EmbedBuilder, Colors, time } = require('discord.js');
const { presence: { name }, guild: { guildId, channelId, roleId } } = require('../config');

module.exports = {
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @returns 
     */
    async presencesUpdate(client) {
        const guild = await client.guilds.fetch({ guild: guildId, force: true });
        const channel = await guild.channels.fetch(channelId);
        const role = await guild.roles.fetch(roleId);
        let index = 0; 
        /**
         * index değişkeni düzgün çalışmayabilir.
         */
        if (
            guild && role && channel && channel.type === ChannelType.GuildText
        ) {
            const listedPresences = guild.presences.cache.filter(member => !member.user.bot);

            for (const [ memberId, presence ] of listedPresences) {     
                index++;
                
                const member = await guild.members.fetch({ user: memberId, force: true });
                if (!member || member.user.bot) continue;

                const hasRole = member.roles.cache.has(roleId);

                const [ first ] = presence?.activities || [];
                const text = first?.type === ActivityType.Custom ? first?.state : first?.name;

                // "name" dizisindeki her elemanla kontrol yapıyoruz
                for (let presenceText of name) {
                    if (hasRole && text !== presenceText) {
                        member.roles.remove(role, 'discord.gg/izlerkalirsin')
                            .then(() => {
                                channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle('<a:nebakiypn:1361434527448432791> Bir kişi aramızdan ayrıldı. <:emoji_9:1358335169966112768>')
                                        .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })    
                                        .setDescription(`• <@&1357161320679477459> rolü, ${member.displayName}'nın/nin durum mesajından \`${presenceText}\` ifadesini kaldırdığı için kendisinden **alındı**.`)
                                        .setThumbnail(member.user.displayAvatarURL())
                                        .setFields([
                                            {
                                                name: 'Kullanıcı etiketi:',
                                                value: `> <@${member.user.id}>`,
                                                inline: true,
                                            },
                                            {
                                                name: 'Güncelleme saati:',
                                                value: `> ${time(parseInt(`${Date.now() / 1000}`), 'R')}`,
                                                inline: true,
                                            },
                                            {
                                                name: 'Toplam kişi:',
                                                value: `> ${index}.`,
                                                inline: true,
                                            },
                                        ])
                                        .setTimestamp()
                                        .setFooter({ text: 'discord.gg/izlerkalirsin', iconURL: "https://images-ext-1.discordapp.net/external/xvbBiGKwN3qcDFcOIVeAy3LTBzYf4pUz2RZDA3N0sRw/https/cdn.discordapp.com/icons/1357115287044100216/00e1e2b184a2b0ebef7b861aa62438a4.webp?format=webp"}),
                                    ],
                                });
                            })
                            .catch(() => undefined);
                    
                        continue;
                    }

                    if (hasRole) continue;
                    if (text !== presenceText) continue;

                    member.roles.add(role, 'discord.gg/izlerkalirsin')
                        .then(() => {
                            channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                    .setColor("Green")
                                    .setTitle('<:emoji_10:1358335186776887447> Bir kişi daha aramıza katıldı! <:of:1361434200930124057>')
                                    .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })    
                                    .setDescription(`• <@&1357161320679477459> rolü, ${member.displayName}'nın/nin durum mesajını \`${presenceText}\` yapması nedeniyle kendisine **verildi**.`)
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setFields([
                                        {
                                            name: 'Kullanıcı etiketi:',
                                            value: `> <@${member.user.id}>`,
                                            inline: true,
                                        },
                                        {
                                            name: 'Güncelleme saati:',
                                            value: `> ${time(parseInt(`${Date.now() / 1000}`), 'R')}`,
                                            inline: true,
                                        },
                                        {
                                            name: 'Toplam kişi:',
                                            value: `> ${index}.`,
                                            inline: true,
                                        },
                                    ])
                                    .setTimestamp()
                                    .setFooter({ text: 'discord.gg/izlerkalirsin', iconURL: 'https://images-ext-1.discordapp.net/external/xvbBiGKwN3qcDFcOIVeAy3LTBzYf4pUz2RZDA3N0sRw/https/cdn.discordapp.com/icons/1357115287044100216/00e1e2b184a2b0ebef7b861aa62438a4.webp?format=png'}),
                                ],
                            })
                            .catch(() => undefined);
                        })
                        .catch(() => undefined);
                }
            }
        }
    },
};
