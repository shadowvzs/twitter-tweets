import { Base } from "js/Base";

class Tweet extends Base {
    constructor(data) {
        super(null, 'div', ['tweet']);
        this.data = data;
        const name = data.user.screen_name,
            ce = this.createElement.bind(this);
        this.appendChild([
            ce('a', ['username'], `<b>${data.user.name}</b> @${name}`, { 
                href: `https://twitter.com/${name}`,
                target: '_blank'
            }),
            ce('div', ['body'], this.linkify(data.text)),
            ce('time', null, this.getDate(data.created_at), { 
                datetime: data.created_at
            }),
            ce('a', ['footer'], "data => console", { 
                onclick: this.show.bind(this),
                title: "Show data in console.log" 
            })
        ]);        
    }

    show() {
        console.log(this.data);
    }

    getDate(raw) {
        const intervals = [
            [31536000, "year"],
            [2592000, "month"],
            [86400, "day"],
            [3600, "hour"],
            [60, "minute"]
        ],
        difference = ~~((+Date.now() - +new Date(raw)) / 1000);
    
        for (const [interval, unit] of intervals) {
            if (difference >= interval) {
                return `${~~(difference/interval)} ${unit} ago`;
            }
        }
        return `less than a minute`;
    }

    linkify(text) {
        const urlEx =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
              aroundEx = /(@[a-z0-9_-]+)/gi,
              hashEx = /(#[a-z0-9_-]+)/gi;
        return text.replace(urlEx, function(url) {
            return '<a href="' + url + '">' + url + '</a>';
        }).replace(aroundEx, function(name) {
            return `<a href="https://twitter.com/${name.substr(1)}" target="_blank">${name}</a>`;
        }).replace(hashEx, function(name) {
            return `<a href="https://twitter.com/hashtag/${name.substr(1)}?src=hash" target="_blank">${name}</a>`;
        });
    }    

    render() {
        return this.DOM;
    }
}