
class Nav extends Base {
    
    constructor(channel, text, targets) {
        super(null, 'a', ['nav']);
        this.parent = channel.NavBar;
        this.text = text;
        this.targets = targets;
        this.state = {
            selected: false
        };
    }

    setState(k, v) {
        // remove selected state/class from siblings
        if (k == "selected") {
            this.parent.navs
                .filter( e => e.state.selected && e != this)
                .forEach( e => {
                    e.DOM.classList.remove("selected");
                    e.state.selected = false;
                });
            if (this.state.selected) {
                return;
            }
        }
        super.setState(k, v);
    }

    static toggleSelected (ev) {
        this.setState("selected", !this.state.selected);
    }

    render() {
        const nav = this.DOM;
        // i use onclick with "for of" with multiple callbacks
        if (this.targets.length > 0) {
            nav.onclick = e => {
                for (const target of this.targets) {
                      target.call(this, e);
                }
            };
        }

        nav.classList[this.state.selected ? 'add' : 'remove']("selected");
        nav.textContent = this.text;
        return nav;
    }
}
