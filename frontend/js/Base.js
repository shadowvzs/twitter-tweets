class Base {
    constructor(channel = false, type = false, className = []) {
        if (channel) {
            this.channel = channel;
            channel[this.constructor.name] = this;
        };
        (type) && ( this.DOM = document.createElement(type) );
        className && className.length > 0 && (this.DOM.classList.add(...className));
    }

    createElement(type, classes = null, childs = null, attr = null) {
        const e = document.createElement(type);
        classes && (e.classList.add(...classes));
        if (typeof childs == "string") {
          e.innerHTML = childs;
        } else if (childs && childs.length) {
            for (const child of childs) {
                e.appendChild(child);
            }
        }

        if (attr) {
            for (const key in attr) {
                if (key !== "data") {
                    e[key] = attr[key];
                } else {
                    for (const k in attr[key]) {
                        e.setAttribute('data-'+k, attr[key][k]);
                    }
                }

            }
        }
        return e;
    }

    appendChild(childs = [], parent = false) {
        if (!childs.length) { return; }
        !parent && (parent = this.DOM);
        childs && !childs.length && (childs = [childs]);
        for (const child of childs) {
            parent.appendChild(child);
        }
    }

    addChilds (Components) {
        if (Components.isArray === false && Components) {
           Components = [Components];
        }
        for (const obj of Components) {
            this.DOM.appendChild(obj.DOM);
        }
    }

/*
    shouldUpdate(oldState, newState) {
        console.log('States: ',oldState, newState);
        return true;
    }
*/
    setState(k, v) {
        const oldState = JSON.parse(JSON.stringify(this.state));
        this.state[k] = v;
        const render = (this.shouldUpdate ? this.shouldUpdate(oldState, this.state) : true) && this.render;
        render && (this.render());
    }
}
