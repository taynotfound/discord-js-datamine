require("dotenv").config()
let Discord = require("discord.js")
let lastreboot;
let { bot, datamine } = require("./src/bot");
const ms = require("ms");
let storage = require("./src/commits.json");
let config = require("./src/config.json")
const filterAndSortUnsentCommits = require("./src/helpers/filterAndSortUnsentCommits");
const getCommits = require("./src/helpers/getCommits");
const handleError = require("./src/helpers/handleError");
const parseBuildNumber = require("./src/helpers/parseBuildNumber");
const writeToDatamine = require("./src/helpers/writeToDatamine");


/*
Init function - Bot goes through all channels that are saved in datamine.json and checks if they have the newest Update. 
*/
async function __init() {
  try {
    const { latestCommit, newDatamine } = await getCommits(storage, datamine);
    datamine = newDatamine;
    const channels = datamine.channels;
    channels.forEach(async (channel) => {
      try {
        let chan = bot.channels.resolve(channel)
        const msgs = await chan.messages.fetch({ limit: 100 }).catch((err) => handleError(bot, chan, err));
        
          const msgsFromBot = msgs.filter((msg) => msg.author.id === bot.user.id);
          const msgsWithEmbed = msgsFromBot.filter((msg) => msg.embeds.length > 0);
         
          const regex = /(Canary\sbuild:\s([0-9]*))/;
          const msg = msgsWithEmbed.find((msg) => regex.test(msg.embeds[0].title));
          const imageRegex = /!\[image]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/mg;
          const imageRegexTwo = /!\[image]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/m;
          if(msg.embeds[0].footer.text !== "Discord Datamine Commit"){
            let desc = latestCommit.comment.body;
            let parsedImages;
              const images = desc.match(imageRegex);
              if (Array.isArray(images)) {
                parsedImages = images.map((image) => {
                  return {
                    old: image,
                    new: imageRegexTwo.exec(image)[1]
                  }
                });
              }
                if (Array.isArray(parsedImages) && parsedImages !== undefined) {
                  parsedImages.map((imageObj) => {
                    desc = desc.replace(imageObj.old, "")
                  });
                }
              
              msg.channel.send(new Discord.MessageEmbed()
              .setTitle(latestCommit.title)
              .setDescription((desc.length > 2000) ? desc.substr(0, 2000) + "..." : desc)
              .setURL(latestCommit.comment.html_url)
              .setColor("BLUE")
              .setTimestamp()
              .setFooter("Discord Datamine Commit"))
              // msg.channel.createMessage(parsedImages.map((imageObj) => imageObj.new).join("\n"));
              if (Array.isArray(parsedImages) && parsedImages !== undefined) {
                msg.channel.createMessage(parsedImages.map((images) => images.new).join("\n"));
              }
            
           else {
            const buildNumber = await parseBuildNumber(msg.embeds[0].title);
            const unsent = filterAndSortUnsentCommits(storage, buildNumber);
            unsent.forEach((unsentCommit) => {
              let desc = unsentCommit.comment.body;
              let parsedImages;
              const images = desc.match(imageRegex);
              if (Array.isArray(images)) {
                parsedImages = images.map((image) => {
                  return {
                    old: image,
                    new: imageRegexTwo.exec(image)[1]
                  }
                });
                if (Array.isArray(parsedImages) && parsedImages !== undefined) {
                  parsedImages.map((imageObj) => {
                    desc = desc.replace(imageObj.old, "")
                  });
                }
              }
          
              msg.channel.send(new Discord.MessageEmbed()
              .setTitle(unsentCommit.title)
              .setDescription((desc.length > 2000) ? desc.substr(0, 2000) + "..." : desc)
              .setURL(unsentCommit.comment.html_url)
              .setColor("BLUE")
              .setTimestamp()
              .setFooter("Discord Datamine Commit"))
              // msg.channel.createMessage(parsedImages.map((imageObj) => imageObj.new).join("\n"));
              if (Array.isArray(parsedImages) && parsedImages !== undefined) {
                msg.channel.createMessage(parsedImages.map((images) => images.new).join("\n"))
              }
            });
          }
          console.log(`[DEBUG] Sent newest Update to Channel ${channel} in Guild ${chan.guild}!`)
          chan.setTopic(`Discord Datamine Feed - Last Checked ${new Date} - © ItsRauf, tayron1 2019 - 2020 - Invite the Bot: https://discord.com/oauth2/authorize?client_id=614539702556557381&scope=bot&permissions=537193552`)
          }else{
            console.log(`[DEBUG] Skipped Channel ${channel} in Guild ${chan.guild}! Already has the newest Commit`)
            chan.setTopic(`Discord Datamine Feed - Last Checked ${new Date} - © ItsRauf, tayron1 2019 - 2020 - Invite the Bot: https://discord.com/oauth2/authorize?client_id=614539702556557381&scope=bot&permissions=537193552`)

          }
          let lrms = new Date().getTime() - lastreboot.getTime() 
          let lrtime = reboottime(lrms)
          bot.user.setActivity(`${config.prefix}help || Ping: ${bot.ws.ping}ms || Last Reboot: ${lrtime}`)
          function getreboottime() {
            let lrms = new Date().getTime() - lastreboot.getTime() 
                    let lrtime = reboottime(lrms)
          
                    return lrtime
          }
          
          bot.reboottime = getreboottime()
      } catch (error) {
        console.error(error);
        handleError(bot, channel, error);
      }
    });
  } catch (error) {
    console.error(error);
  }
}
/*
End init Function
*/

/*
Ready event - Just logs that its alive and runs the init function. Defines that the init function runs every ... mins
*/
bot.once("ready", () => {
  console.log(bot.user.username + " is alive!");
  lastreboot = new Date()
  __init().catch((err) => console.error(err));
  setInterval(__init, ms(config.interval)); // Makes a interval to run the init function
  bot.user.setActivity(`Loading... Getting Information...`)
});

// Logs the bot in with the Token that is given in the .env file
bot.login(process.env.TOKEN).catch((err) => { console.log("failed to start\n" + err) });


// Some functions that are needed or good to have
function reboottime(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  if(minutes === 0 && seconds === 0) return "Just now"
  if(minutes === 0 && seconds === 1) return `${seconds} sec ago`
  if(minutes === 0 && seconds !== 0) return `${seconds} secs ago`
  if(minutes === 1 && seconds === 0) return `${minutes} min ago`
  if(minutes !== 0 && seconds !== 0) return `${minutes} mins ago`
  if(minutes !== 0 && seconds !== 0) return `${minutes} mins and ${seconds} secs ago`
  return minutes || "0" + ":" + (seconds < 10 ? '0' : '') + seconds || "0";
}
function mstotime(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);

  return minutes || "0" + ":" + (seconds < 10 ? '0' : '') + seconds || "0";
}
