const { Command } = require(`discord.js-commando`);
const { RichEmbed } = require(`discord.js`);
const { options } = require(`../../options`);
const log = require(`node-file-logger`);
log.SetUserOptions(options);
let path = require(`path`);
let randomHexColor = require(`random-hex-color`);

module.exports = class FlipCommand extends Command {
  constructor(client) {
    super(client, {
      name: `flip`,
      group: `economy`,
      memberName: `flip`,
      description: `Flips a coin. If you guess the coin state your bet gets multiplied by 1.5!`,
      examples: [`flip 10 pins (pins = tails in this case)`, `flip 10 p`],
      args: [
        {
          key: `bet`,
          prompt: `How many points do you wish to bet?`,
          type: `integer`,
          default: 0
        },
        {
          key: `gstate`,
          prompt: `Which side do you think the coin's going to land on?`,
          type: `string`
        }
      ]
    });
  }
  run(msg, { bet, gstate }) {
    let cpub = `https://www.dropbox.com/s/a0w5kdqterb29gk/cpu-back.png?dl=1`;
    let cpuf = `https://www.dropbox.com/s/dhmpmc16wt1glfu/cpu-front.png?dl=1`;
    let key = `${msg.guild.id}-${msg.author.id}`;
    let enmap = this.client.points;
    let cf = coinFlip();
    let gstateConv;
    let embed = new RichEmbed()
      .setTitle(`Flip result:`)
      .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
      .setColor(randomHexColor());

    function coinFlip() {
      return Math.floor(Math.random() * 2) === 0;
    }

    try {
      if (gstate.toLowerCase() === `p` || gstate.toLowerCase() === `pins`) {
        gstateConv = true;
      } else if (
        gstate.toLowerCase() === `h` ||
        gstate.toLowerCase() === `heads`
      ) {
        gstateConv = false;
      } else {
        return msg.reply(`Invalid guess`);
      }

      if (enmap.get(key, `points`) < bet) {
        return msg.reply(`Insufficent funds.`);
      }
      if (bet <= 1) {
        return msg.reply(`You cannot bet less than 2 points!`);
      }
      if (gstateConv === cf) {
        let toAdd = Math.floor(bet * 1.5);
        enmap.math(key, `+`, toAdd, `points`);
        embed
          .setDescription(
            `${
              gstateConv === true
                ? `CPU has been successfully inserted!`
                : `Overclock is stable!`
            } +${
              toAdd === 1 ? `${toAdd} point!` : `${toAdd} points!`
            } (Total: ${enmap.get(key, `points`)})`
          )
          .setImage(cf === true ? cpub : cpuf);
      } else {
        enmap.math(key, `-`, bet, `points`);
        embed
          .setDescription(
            `${
              gstateConv === true
                ? `You've bent the pins :(`
                : `You fried the poor CPU!`
            } -${
              bet === 1 ? `${bet} point!` : `${bet} points!`
            } (Total: ${enmap.get(key, `points`)})`
          )
          .setImage(cf === true ? cpub : cpuf);
      }
      msg.say({ embed });
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
