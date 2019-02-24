import * as Discord from 'discord.js'

const join = async (message: Discord.Message) =>
  new Promise(async (resolve, reject) => {
    const voiceChannel = message.member.voiceChannel

    if (!voiceChannel || voiceChannel.type !== 'voice') {
      await message.reply('I could not connect to your voice channel!')
      return
    }

    if (!voiceChannel.joinable) {
      if (voiceChannel.full) {
        await message.reply(
          'I do not have permission to join your voice channel! That channel is full.'
        )
        return
      }

      await message.reply(
        'I do not have permission to join your voice channel!'
      )
      return
    }

    await voiceChannel
      .join()
      .then(Connection => resolve(Connection))
      .catch(err => reject(err))
  })

export default join
