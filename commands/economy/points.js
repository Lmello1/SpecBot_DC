const { Command } = require(`discord.js-commando`);
const { options } = require(`../../options`);
const log = require(`node-file-logger`);
const jimp = require(`jimp`);
log.SetUserOptions(options);
let path = require(`path`);

module.exports = class PointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: `points`,
      group: `economy`,
      memberName: `points`,
      description: `Shows how many points you have.`,
      guildOnly: true,
      examples: [`points`, `points @user#0000`],
      args: [
        {
          key: `member`,
          prompt: `Whose info would you want to see?`,
          default: ``,
          type: `member`,
          error: `Invalid user mention. Please try again.`
        }
      ]
    });
  }
  run(msg, { member }) {
    let key;
    let client = this.client;

    function sendCard(user, key) {
      let images = [
        `${__dirname}/raw/rect.png`,
        user.displayAvatarURL,
        `${__dirname}/raw/mask.png`
      ];
      let jimps = [];
      let bg, avatar, mask;
      let points = client.points.get(key, `points`);
      let level = client.points.get(key, `level`);

      for (let i = 0; i < images.length; i++) {
        jimps.push(jimp.read(images[i]));
      }

      Promise.all(jimps)
        .then(data => {
          return Promise.all(jimps);
        })
        .then(data => {
          bg = data[0];
          avatar = data[1];
          mask = data[2];
          return jimp.loadFont(`${__dirname}/font/noto_sans_ui_16_b.fnt`);
        })
        .then(font => {
          let circleAvatar = avatar
            .clone()
            .resize(80, 80)
            .mask(mask, 0, 0);
          bg
            .composite(circleAvatar, 10, 10)
            .print(font, 100, 22, `Points: ${points}`)
            .print(font, 100, 52, `Level: ${level}`)
            .writeAsync(`${__dirname}/export/card${user.id}.png`)
            .then(
              setTimeout(
                () =>
                  msg.say({
                    file: `${__dirname}/export/card${msg.author.id}.png`
                  }),
                1000
              )
            );
        });
    }

    try {
      if (member === ``) {
        key = `${msg.guild.id}-${msg.author.id}`;
        sendCard(msg.author, key);
      } else {
        try {
          key = `${msg.guild.id}-${member.user.id}`;
          sendCard(member.user, key);
        } catch {
          msg.say(`This user doesn't have any points!`);
        }
      }
    } catch {
      msg.reply(
        `An error has occured (The database is most likely not ready yet). Try waiting for a moment before retrying.`
      );
    }

    let toLog = `${path.basename(__filename, `.js`)} was used by ${
      msg.author.username
    }.`;

    console.log(toLog);
    log.Info(toLog);
  }
};
