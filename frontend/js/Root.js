import { Content } from "js/Content";
import { NavBar } from "js/NavBar";
import { Service } from "js/Service";
// localStorage.clear(); // reset the settings

const initData = {
    ycombinator: [],
    MakeSchool: [],
    newsycombinator: [],
}

class Root extends Base {
    constructor () {
        // channel is a horizontally shared object
        const channel = {};
        super(channel, 'div', ['root']);
        let settings = JSON.parse(localStorage.getItem('settings') || "{}"),
              loadedData = Object.keys(settings).filter(e => e != "theme").map(e => ({[e]: []}));
        if (!Object.keys(settings).length) {
            loadedData = [
                { ycombinator: [] },
                { MakeSchool: [] },
                { newsycombinator: [] },
            ];
        }
        this.state = {
            data: Object.assign( {}, ...loadedData),
            settings: settings
        }
        // register components
        const ContentComponent = new Content(channel);
        const NavBarComponent = new NavBar( channel,
            [
                ["Home", [Nav.toggleSelected, ContentComponent.update.bind(ContentComponent, 'Twitter')]],
                ["Settings", [Nav.toggleSelected, ContentComponent.update.bind(ContentComponent, 'Setting')]]
            ]
        );
        // for debug i can add channel here, else could be private
        // global.channel = channel;
        this.render();
    }

    render() {
        this.addChilds([
            this.channel.NavBar,
            this.channel.Content
        ]);
        document.body.appendChild(this.DOM);
    }
}
