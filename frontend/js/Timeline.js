import { Tweet } from "js/Tweet";

class Timeline extends Base {

    constructor(channel, userName, parent) {
        const rootState = channel.Root.state;
        super(null, 'div', ['timeline']);
        this.userName = userName;
        this.state = {
            list: rootState.data[userName] || [],
            setting: rootState.settings[userName],
        };
        parent.registerEvents(this.DOM, this.state.setting.order);
        this.parent = parent;
        this.load = this.load.bind(this);
        this.remove = this.remove.bind(this);
        this.DOM.name = userName;
        this.createUI();
        this.loading = false;
        this.load();
    }

    createUI() {
        const timelineLink = `<a href="https://twitter.com/${this.userName}" target="_blank"> @${this.userName} </a>`;//,
        this.container = this.createElement('div', null, null);
        this.appendChild([
            this.createElement('h1', null, timelineLink),
            this.createElement('div', ['refresh'], "&#128472;", { onclick: this.load, title: "Reload" }),
            this.createElement('div', ['close'], "&times;", { onclick: this.remove, title: "Remove" }),
            this.container
        ]);
        this.container.innerHTML = '<i>loading... </i>';
    }

    remove() {
        if (Object.keys(this.parent.childs).length == 1) {
            return alert("Don't remove the last child ;) ");
        }
        //this.reOrder();
        const key = this.userName,
              Settings = this.parent.channel.Setting;
        const timelineSetting = Settings.removeTimelineSettings(key);
        delete this.parent.childs[key]
        this.parent.users = Object.keys(this.parent.childs);
        this.DOM.remove();
        Settings.save();
    }

    async load() {
        this.container.innerHTML = '<legend>loading... </legend>';
        if (this.loading) { return; }
        const { limit, day } = this.state.setting;
        this.DOM.classList.add('wait');
        this.loading = true;
        const result = JSON.parse(await Service.getTweets(this.userName, limit, day));
        this.DOM.classList.remove('wait');
        this.loading = false;        
        if (result.error) {
            return alert(`${this.userName}: ${result.error}`);
        }
        this.setState('list', result);
    }

    render() {
        if (!this.loading) {
            const setting = this.state.setting;
            const tweets = this.state.list.map( e => new Tweet(e) );
            this.container.innerHTML = '';
            this.appendChild(tweets.map(e => e.render()), this.container);
        }
        return this.DOM;
    }
}