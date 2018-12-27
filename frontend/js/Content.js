import { Twitter } from "js/Twitter";
import { Setting } from "js/Setting";

class Content extends Base {
    constructor(channel) {
        super(channel, 'div', ['content']);
        this.childs = {
            'Setting': new Setting(channel),
            'Twitter': new Twitter(channel)
        };
        this.render();
    }

    update(component, ev) {
        this.DOM.innerHTML = '';
        this.childs[component].render && (this.DOM.appendChild(this.childs[component].render()));

    }

    render() {
        return this.DOM;
    }
}
