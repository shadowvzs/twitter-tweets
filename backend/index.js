const express = require('express');
const twitter = require('./service/twitter.js');
const app = express();
const port = 8000;
const defaultTweetAmount = 20;

app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, please use the following url format: ip:port/name/count');
});


app.get('/:name/:count/:day', async (req, res) => {
    const count = Number(req.params.count),
        day = Number(req.params.day),
        name = req.params.name .trim();
    if (isNaN(count) || isNaN(day) || !name) {
        return res.send(JSON.stringify(false));
    }
    const request = twitter(req.params.name, count);
    try {
        const now = new Date(),
            oldest = now.setDate(now.getDate() - day);
            res.send(JSON.stringify((await request)            // backend filtering
                    .filter(e => +new Date(e.created_at) >= oldest)
                    .slice(0, count)
            ));
    } catch(err) {
        console.log(err)
        res.send(JSON.stringify({status: false, error: "not exist or you must login"}));
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));