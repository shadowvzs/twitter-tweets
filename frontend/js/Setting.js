import { Themes, StyleChanger } from "js/Theme";

class Setting extends Base {
    
    constructor(channel) {
        super(channel, 'div', ['settings']);
        this.state = channel.Root.state.settings;
        if (!Object.keys(this.state).length) {
            const userData = channel.Root.state.data,
                  users = Object.keys(userData),
                  tomorrow = +Date.now() + 86400000;
            users.forEach((e, i) => {
                this.state[e] = {
                    order: i,
                    limit: 20,
                    day: 30
                };
            });
            this.state.theme = 'Light Theme';
        }
        this.themes = ['Light Theme', 'Dark Theme'];
        this.add = this.add.bind(this);
        this.changeTheme = this.changeTheme.bind(this);
        this.changeTimelineSettings = this.changeTimelineSettings.bind(this);
        this.save();
        StyleChanger(this.state.theme);
        this.createUI();
    }

    createUI() {
        const settings = Object.keys(this.state),
            theme = this.state[settings.splice(settings.indexOf('theme'), 1)],
            ce = this.createElement.bind(this);

        this.DOM.innerHTML = '';

        this.newUserName = ce('input', null, null, { type: "text", name: "newUserName" });
        this.container = ce('div', ['timelines-settings'], settings.map(e => this.addTimelineSettings(e, ce)));
        this.appendChild([
            ce('div', ['misc'], [
                    this.newUserName,
                    ce('button', ['btn', 'add-user'], 'Add', { onclick: this.add }),
                    ce('select', ['theme-select'], this.themes.map(e => ce(
                            'option', null, e, { value: e, selected: e == theme }
                        )), { onchange: this.changeTheme }
                    ),
                    ce('p', ['order-note'], 'in [HOME] you can order the columns with mouse'),
                ]
            ),
            this.container
        ]);
        this.newUserName = this.DOM.querySelector('input[name="newUserName"]');
        this.DOM.querySelectorAll('.timeline-settings input')
                .forEach( e => e.oninput = this.changeTimelineSettings );
    }

    createInput(timeline, type) {
        const name = timeline+"#"+type;
        let label = "",
            placeholder = "",
            value = this.state[timeline][type] || false;
        if (type == "limit") {
            [label, placeholder] = ["Limit", "How much tweet"];
            value = value || 20;
        } else if (type == "day") {
            [label, placeholder] = ["Day", "How old could"];
            value = value || 30;
        }

        return `<label for=${name}>${label}:</label>
            <input type="number" name="${name}" value="${value}" placehold="${placeholder}" min="1" max="100" />`;
    }

    addTimelineSettings(e, ce = false) {
        !ce && (ce = this.createElement.bind(this));
        const newTimelineSetting = ce('div', ['timeline-settings'], [
            ce('h3', null, e),
            ce('div', ['table-row'], this.createInput(e, "limit")),
            ce('div', ['table-row'], this.createInput(e, "day"))
        ], { "data": { id: e } });
        newTimelineSetting.querySelectorAll('input')
                        .forEach( e => e.oninput = this.changeTimelineSettings );
        return newTimelineSetting;
    }

    removeTimelineSettings(e) {
        const timelineSetting = this.DOM.querySelector(`.timeline-settings[data-id="${e}"]`);
        timelineSetting && (timelineSetting.remove());
        delete this.state[e];
        delete this.channel.Root.state.data[e];
    }

    add(ev) {
        const name = this.newUserName.value.trim();
        ev.preventDefault();
        if (!name || this.state[name]) { return alert('Choose different name!'); }
        this.newUserName.value = '';
        this.channel.Root.state.data[name] = [];
        const order = Math.max(...Object.keys(this.state).map(e => +(this.state[e].order || 0))) + 1;
        this.state[name] = {
            order: order,
            limit: 20,
            day: 30
        }
        this.channel.Twitter.add(name);
        this.container.appendChild(this.addTimelineSettings(name));
        this.save();
    }

    changeTheme(ev) {
        const theme = ev.target.value;
        this.state.theme = theme;
        this.save();
        StyleChanger(theme);
    }

    changeTimelineSettings(ev) {
        const target = ev.target,
              [userName, key] = target.getAttribute('name').split('#'),
              value = target.value.trim();

        if (!value) { return; }
        const setting = this.state[userName],
              timeline = this.channel.Twitter.childs[userName];
        setting[key] = value;
        timeline.setState('setting', setting);
        timeline.load();
        this.save();
    }

    save() {
        localStorage.setItem('settings', JSON.stringify(this.state));
    }

    render() {
        return this.DOM;
    }
}
