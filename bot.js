var Discord = require('discord.js');
var nodeSpotifyWebHelper = require('node-spotify-webhelper');

var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper();
var config = require("./config");
var bot = new Discord.Client({
    autorun: true
});

var connected = false;

bot.on('ready', function () {
    connected = true;
    bot.on('disconnected', function () {
        connected = false;
        setTimeout(function () {
            bot.connect();
        }, 5000);
    });
    console.log(bot.user.username + " - (" + bot.user.id + ")");
});

var curr = "";
// get the name of the song which is currently playing 
setInterval(function () {
    if(!connected) return;
    spotify.getStatus(function (err, res) {
        if (err) {
            return console.error(err);
        }
        if (res.playing) {
            var next = "♪" + res.track.track_resource.name + " - " + res.track.artist_resource.name + "♪";
            if (next == curr) return;
            console.log(next);
            bot.user.setPresence({
                game: {
                    name: next,
                    type: 0
                }
            });
            curr = next;
        } else {
            curr = "";
            bot.user.setPresence({
                game: {
                    name: "",
                    type: 0
                }
            });
        }
    })
}, 3000);

bot.login(config.token).catch(console.error);