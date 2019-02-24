import * as Discord from 'discord.js'

const leave = async (message: Discord.Message) =>
  message.member.voiceChannel.leave()

export default leave
