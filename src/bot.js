// const Eris = require("eris");
let Discord = require("discord.js")
let datamine = require("./datamine.json");
let config = require("./config.json")
const writeToDatamine = require("./helpers/writeToDatamine");
const findStoredCommit = require("./helpers/findStoredCommit");
let fs = require("fs")
const bot = new Discord.Client();
const dataminechannels = datamine.channels;

//message event *who thought something else*
bot.on("message", async (msg) => {
  if(msg.author.bot) return;
  
  if (msg.content.startsWith(config.prefix)) {
    const cmd = msg.content.split(config.prefix)[1].split(" ")[0];


    //Here are all Commands and here is what to do everytime a command runs
    switch (cmd) {
      case "subscribe":
        if(!msg.guild.me.hasPermission(["MANAGE_MESSAGES","SEND_MESSAGES","MANAGE_CHANNELS","EMBED_LINKS"])) return msg.reply("Hey You!\nI dont have my needed Permissions!\nHere is a list of all of them that i need:\nMANAGE_MESSAGES, SEND_MESSAGES, MANAGE_CHANNELS, EMBED_LINKS")

        if (datamine.channels.indexOf(msg.channel.id) === -1) {
          datamine.channels.push(msg.channel.id);
          msg.channel.send(new Discord.MessageEmbed()
              .setTitle("Success")
              .setColor("GREEN")
              .setDescription("This channel has been setup to be notified of Datamine Updates. Unsubscribe by using `"+ config.prefix +"unsubscribe`")
              .setTimestamp())
            .then(async (_) => {
              const newDatamine = await writeToDatamine(datamine);
              datamine = newDatamine
            }).then((_) => {
              console.log(datamine.current)
              msg.channel.send(new Discord.MessageEmbed()
                .setTitle(datamine.current.title)
                .setDescription(datamine.current.comment.body.substr(0, 2000) + "...")
                .setURL(datamine.current.comment.html_url)
                .setColor("BLUE")
                .setFooter("Discord Datamine Commit"))

            });
        } else {
         
          msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Error")
            .setColor("RED")
            .setDescription("This channel is already setup to be notified of Datamine Updates. Unsubscribe by using `"+ config.prefix +"unsubscribe`")
            .setTimestamp())
        }
        break;
      case "unsubscribe":
        if(!msg.guild.me.hasPermission(["MANAGE_MESSAGES","SEND_MESSAGES","MANAGE_CHANNELS","EMBED_LINKS"])) return msg.reply("Hey You!\nI dont have my needed Permissions!\nHere is a list of all of them that i need:\nMANAGE_MESSAGES, SEND_MESSAGES, MANAGE_CHANNELS, EMBED_LINKS")

        if (datamine.channels.indexOf(msg.channel.id) === -1) {
          
          msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Error")
            .setDescription("This channel has not been setup to be notified of Datamine Updates. Subscribe by using `"+ config.prefix +"subscribe`")
            .setColor("RED"))
        } else {
          const channel = datamine.channels.indexOf(msg.channel.id);
          datamine.channels.splice(channel, 1);
          const newDatamine = await writeToDatamine(datamine);
          datamine = newDatamine
          
          msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Success")
            .setColor("GREEN")
            .setDescription("This channel is no longer being notified of Datamine Updates. Subscribe by using `"+ config.prefix +"subscribe`"))
        }
        break;
      case "help":
        if(dataminechannels.includes(msg.channel.id) ){
          msg.delete()
          let e = await msg.reply("Please do not run any Commands in the Datamine Feed Channel!!\nTo Unsubscribe use: `"+ config.prefix +"unsubscribe`!!\n\nThis message will be deleted in 5 seconds!!")
          setTimeout(function(){
            e.delete()
          },5000)
          return;
        }
        if(!msg.guild.me.hasPermission(["MANAGE_MESSAGES","SEND_MESSAGES","MANAGE_CHANNELS","EMBED_LINKS"])) return msg.reply("Hey You!\nI dont have my needed Permissions!\nHere is a list of all of them that i need:\nMANAGE_MESSAGES, SEND_MESSAGES, MANAGE_CHANNELS, EMBED_LINKS")

        msg.channel.send(new Discord.MessageEmbed()
          .setTitle("Discord Datamine Bot")
          .setURL("")
          .setDescription("Hello,\nI'm "+bot.user.username+" !\nI'm a Bot that Collects every commit from the Discord Datamine!\nTo invite me use this [link](https://discord.com/oauth2/authorize?client_id=614539702556557381&scope=bot&permissions=537193552)\n\nAll Commands\n```md\n# subscribe\n- Subscribe to the Discord Datamine Feed (Current Channel)\n\n# unsubscribe\n- Unsubscribe from the Discord Datamine Feed (Current Channel)\n\n# help\n+ Displays this Embed\n\n# ping\n+ See my Ping\n\n# info\n+ See Infos about me!\n\n# debug\n+ Do a quick debug```\nPrefix: `"+ config.prefix +"`\n\n\n*Note:\nThis is a modified fork of [ItsRauf/discord-datamine-bot](https://github.com/ItsRauf/discord-datamine-bot)! \nThis Bot has been rewritten in Discord.js and got some commands added! \n Full credit is going to [ItsRauf/discord-datamine-bot](https://github.com/ItsRauf/discord-datamine-bot)!*")
          .setFooter("© ItsRauf, tayron1 2019 - 2020")
          .setColor("PURPLE")
          .setTimestamp())
        break;
      case "ping":
        if(dataminechannels.includes(msg.channel.id) ){
          msg.delete()
          let e = await msg.reply("Please do not run any Commands in the Datamine Feed Channel!!\nTo Unsubscribe use: `"+ config.prefix +"unsubscribe`!!\n\nThis message will be deleted in 5 seconds!!")
          setTimeout(function(){
            e.delete()
          },5000)
          return;
        }
        if(!msg.guild.me.hasPermission(["MANAGE_MESSAGES","SEND_MESSAGES","MANAGE_CHANNELS","EMBED_LINKS"])) return msg.reply("Hey You!\nI dont have my needed Permissions!\nHere is a list of all of them that i need:\nMANAGE_MESSAGES, SEND_MESSAGES, MANAGE_CHANNELS, EMBED_LINKS")

        msg.channel.send(new Discord.MessageEmbed()
          .setDescription("Calculating....")).then(async m => {
          var ping = m.createdTimestamp - msg.createdTimestamp;
          m.edit(new Discord.MessageEmbed()
            .setTitle("Ping Command")
            .setDescription("**Discord.js Websocket Ping**\n`CALCULATING...`\n\n**Ping GitHub Repo API**\n`CALCULATING....`\n\n**Discord.js Message Editing**\n`CALCULATING...`")
            .setColor("PURPLE")).then(async m2 => {
            let start = new Date()
            let end;
            await require("axios").get('https://api.github.com/')
              .then((response) => {
                end = new Date()



              });
            let gitping = end.getTime() - start.getTime()
            m2.edit(new Discord.MessageEmbed()
              .setTitle("Ping Command")
              .setDescription("**Discord.js Websocket Ping**\n`" + bot.ws.ping + "ms`\n\n**Ping GitHub Repo API**\n`" + gitping + "ms`\n\n**Discord.js Message Editing**\n`" + ping + "ms`")
              .setColor("PURPLE"))

          })
        })
        break;
      case "debug":
        if(dataminechannels.includes(msg.channel.id) ){
          msg.delete()
          let e = await msg.reply("Please do not run any Commands in the Datamine Feed Channel!!\nTo Unsubscribe use: `"+ config.prefix +"unsubscribe`!!\n\nThis message will be deleted in 5 seconds!!")
          setTimeout(function(){
            e.delete()
          },5000)
          return;
        }
        if(!msg.guild.me.hasPermission(["MANAGE_MESSAGES","SEND_MESSAGES","MANAGE_CHANNELS","EMBED_LINKS"])) return msg.reply("Hey You!\nI dont have my needed Permissions!\nHere is a list of all of them that i need:\nMANAGE_MESSAGES, SEND_MESSAGES, MANAGE_CHANNELS, EMBED_LINKS")

        msg.channel.send(new Discord.MessageEmbed()
          .setDescription("Getting Info...")).then(async m => {
          var ping = m.createdTimestamp - msg.createdTimestamp;

          let start = new Date()
          let end;
          await require("axios").get('https://api.github.com/')
            .then((response) => {
              end = new Date()



            });
          let gitping = end.getTime() - start.getTime()
          const newDatamine = await writeToDatamine(datamine);
          datamine = newDatamine


          let authorname;
          let authorurl;
          let filemsg = ""
          let statsmsg = ""
          await require("axios").get(datamine.current.comment.url.replace("/comments", "")).then((response) => {
            authorname = response.data.author.login
            authorurl = response.data.author.url
            response.data.files.forEach(file => {
              filemsg += `Filename: ${file.filename}\nStatus: ${file.status}\nAddidtions: ${file.additions}\nDeletions: ${file.deletions}\n\n`
            });
            statsmsg += `Total: ${response.data.stats.total}\nAdditions: ${response.data.stats.additions}\nDeletions: ${response.data.stats.deletions}`
          });
          m.edit(new Discord.MessageEmbed()
            .setTitle("Debug Command")
            .addField("**__PINGS__**", "**Discord.js Websocket Ping**\n`" + bot.ws.ping + "ms`\n\n**Ping GitHub Repo API**\n`" + gitping + "ms`\n\n**Discord.js Message Editing**\n`" + ping + "ms`", true)
            .addField("**__LAST DATAMINE__**", `**Title**\n${datamine.current.title}\n\n**Build Number**\n${datamine.current.buildNumber}\n\n**Comment Body**\n\n${datamine.current.comment.body}\n\n**Comment URL**\n[Click here](${datamine.current.comment.html_url})`, true)
            .addField("**__LAST COMMIT__**", `**Author**\n[${authorname}](${authorurl})\n\n\n**Files**\n${filemsg}\n\n\nStats: ${statsmsg}`, true)
            .setDescription("This is a little messy command but its open for all! Enjoy or sth :shrug:")
            .setColor("PURPLE")
            .setFooter(`Last Reboot ${bot.reboottime}`)
          )

        })
        break;
      case "info":
        if(dataminechannels.includes(msg.channel.id) ){
          msg.delete()
          let e = await msg.reply("Please do not run any Commands in the Datamine Feed Channel!!\nTo Unsubscribe use: `"+ config.prefix +"unsubscribe`!!\n\nThis message will be deleted in 5 seconds!!")
          setTimeout(function(){
            e.delete()
          },5000)
          return;
        }
        if(!msg.guild.me.hasPermission(["MANAGE_MESSAGES","SEND_MESSAGES","MANAGE_CHANNELS","EMBED_LINKS"])) return msg.reply("Hey You!\nI dont have my needed Permissions!\nHere is a list of all of them that i need:\nMANAGE_MESSAGES, SEND_MESSAGES, MANAGE_CHANNELS, EMBED_LINKS")

        msg.channel.send(new Discord.MessageEmbed()
          .setDescription("Getting Info...")).then(async m => {
          var ping = m.createdTimestamp - msg.createdTimestamp;

          let start = new Date()
          let end;
          await require("axios").get('https://api.github.com/')
            .then((response) => {
              end = new Date()



            });
          let gitping = end.getTime() - start.getTime()
          let packages = []
          let dependencies = require("../package.json").dependencies
          let dpmsg = JSON.stringify(dependencies)
          let totalSeconds = (bot.uptime / 1000);
          let days = Math.floor(totalSeconds / 86400);
          totalSeconds %= 86400;
          let hours = Math.floor(totalSeconds / 3600);
          totalSeconds %= 3600;
          let minutes = Math.floor(totalSeconds / 60);
          let seconds = Math.floor(totalSeconds % 60);
          m.edit(new Discord.MessageEmbed()
            .setTitle("Info Command")
            .addField("**Pings**", "```md\n#Discord.js Websocket Ping\n" + bot.ws.ping + "ms\n\n# Ping GitHub Repo API\n" + gitping + "ms\n\n# Discord.js Message Editing\n" + ping + "ms```", true)
            .addField("**Technichal Information**", "```md\n" + `# Libary\n Discord.js\n\n# Packages used \n${dpmsg}\n\n# Runtime\n NodeJS\n\n# Runtime Version\n${process.version}` + "```", true)
            .addField("**Client Information**", "```md\n" + `# Guilds\n${bot.guilds.cache.size}\n\n# Users\n${bot.users.cache.size}\n\n# Bot Uptime\n${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds\n\n# ShardID\n${msg.guild.shardID}\n\n# Fetched Commits\n${require("./commits.json").length}\n\n# Subscribers\n${require("./datamine.json").channels.length}` + "```", true)
            .setDescription("Here is a bit Information about the Bot!\n\nDatamining Repo: \n[Click here](https://github.com/DJScias/Discord-Datamining/)\n*Note:\nThis is a modified fork of [ItsRauf/discord-datamine-bot](https://github.com/ItsRauf/discord-datamine-bot)! \nThis Bot has been rewritten in Discord.js and got some commands added! \n Full credit is going to [ItsRauf/discord-datamine-bot](https://github.com/ItsRauf/discord-datamine-bot)!*")

            .setColor("PURPLE")
            .setFooter(`Last Reboot ${bot.reboottime}`)
          )

        })
        break;
        /* 
        ###### Here you have a template how a command should start ######
        case "TEMPLATE":
          if(dataminechannels.includes(msg.channel.id) ){
            msg.delete()
            let e = await msg.reply("Please do not run any Commands in the Datamine Feed Channel!!\nTo Unsubscribe use: `"+ config.prefix +"unsubscribe`!!\n\nThis message will be deleted in 5 seconds!!")
            setTimeout(function(){
              e.delete()
            },5000)
            return;
          }
          if(!msg.guild.me.hasPermission(["MANAGE_MESSAGES","SEND_MESSAGES","MANAGE_CHANNELS","EMBED_LINKS"])) return msg.reply("Hey You!\nI dont have my needed Permissions!\nHere is a list of all of them that i need:\nMANAGE_MESSAGES, SEND_MESSAGES, MANAGE_CHANNELS, EMBED_LINKS")
  
          break;
          */
      default:
        break;
    }
  }
});


// If something dum dum happens it logs the error
process.on("unhandledRejection", (err) => {
  console.log(err);
});

module.exports = {
  bot,
  datamine
};