const config = require("../config/config.json");

// ThisIsAPassword
//container ip: 172.18.0.2
var Twitter = require('twitter');
var T = new Twitter(config);

const search = (screen_name = null, count = null) => {
    return new Promise ((resolve, reject) => {
        T.get('statuses/user_timeline', { screen_name, count }, function(error, tweets, response) {
            if (!error) {
                resolve (tweets);
            } else {
                reject (error);
            }
        });
    });
}

module.exports = search;
