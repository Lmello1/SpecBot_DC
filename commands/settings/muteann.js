const { Command } = require(`discord.js-commando`)
const { sendErrorEmbed, sendSuccessEmbed } = require(`../../libs/embeds`)

module.exports = class MuteAnnCommand extends Command {
  constructor (client) {
    super(client, {
      description: `If you wish ot stop recieving SpecBot announcements in your server run this command. TO enable them; run it again`,
      examples: [`muteann`],
      group: `settings`,
      memberName: `muteann`,
      name: `muteann`
    })
  }

  hasPermission (msg) {
    return this.client.isOwner(msg.author) || msg.member.hasPermission(`ADMINISTRATOR`)
  }

  run (msg) {
    switch (this.client.provider.get(msg.guild, `muteann`, null)) {
    case null:
      this.client.provider.set(msg.guild, `muteann`, false)
        .then(s => sendSuccessEmbed(msg, `✅ This guild hasn't set this option yet`, `Setting it to \`${s}\``))
      break
    case false:
      this.client.provider.set(msg.guild, `muteann`, true)
        .then(sendErrorEmbed(msg, `❌ You will no longer recieve SpecBot announcements`, `To enable them run \`-muteann\``))
      break
    case true:
      this.client.provider.set(msg.guild, `muteann`, false)
        .then(sendSuccessEmbed(msg, `✅ You will recieve SpecBot annoucements from now on`, `To disable them run \`-muteann\``))
      break
    }
  }
}
