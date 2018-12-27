import { Timeline } from "js/Timeline";

class Twitter extends Base {

    constructor(channel) {
        super(channel, 'div', ['twitter']);
        this.childs = {};
        this.dragged = null;
        this.eventList = ['dragstart', 'dragend', 'dragover', 'drop'];
        this.eventList.forEach(e => this[e] = this[e].bind(this) );
        this.createUI();
        this.host = "172.18.0.2:8000/"
    }

    createUI() {
        this.users = Object.keys(this.channel.Root.state.data);
        this.users.forEach(e => this.childs[e] = new Timeline(this.channel, e, this) );
    }

    add(name) {
        if (this.childs[name]) { return this.childs[name].render(); }
        this.childs[name] = new Timeline(this.channel, name, this);
        this.users.push(name);
        this.DOM.appendChild(this.childs[name].render());
        this.render();
    }

    /* EVENTS related - starting */

    getEventData(ev, prevent = false) {
        const target = ev.currentTarget || ev.target;
        prevent && (ev.preventDefault());
        return [ target, target.dataset.order ];
    }

    registerEvents(DOM, order) {
        DOM.setAttribute('draggable', true);
        DOM.style.order = order;
        DOM.dataset.order = order;
        this.eventList.forEach(e => DOM[`on${e}`] = this[e] );
    }

    dragstart(ev) {
        const [target, order] = this.getEventData(ev);
        ev.stopPropagation();
        ev.dataTransfer.setData('text/html', null);
        target.classList.add('draging');
        this.dragged = target
    }

    dragend(ev) {
        const [target, order] = this.getEventData(ev);
        this.dragged.classList.remove('draging');
    }

    dragover(ev) {
        ev.preventDefault();
    }

    drop(ev) {
        const [target, order] = this.getEventData(ev);
        let [a, b] = [target.dataset.order, this.dragged.dataset.order];
        this.setOrder(target, b);
        this.setOrder(this.dragged, a);
        this.channel.Setting.save();
    }

    /* EVENTS related - ending */

    setOrder(target, order) {
        const state = this.channel.Setting.state;
        target.dataset.order = order;
        target.style.order = order;
        state[target.name].order = order;
    }

    render() {
        this.DOM.innerHTML = '';
        this.users.forEach(e => this.DOM.appendChild(this.childs[e].render()) )
        return this.DOM;
    }
}
