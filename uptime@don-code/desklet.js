const Cinnamon = imports.gi.Cinnamon;
const CinnamonDesktop = imports.gi.CinnamonDesktop;
const St = imports.gi.St;

const Desklet = imports.ui.desklet;
const Settings = imports.ui.settings;

function UptimeDesklet(metadata, desklet_id){
    this._init(metadata, desklet_id);
}

UptimeDesklet.prototype = {
    __proto__: Desklet.Desklet.prototype,

    _init: function(metadata, desklet_id){
        Desklet.Desklet.prototype._init.call(this, metadata);
        this._uptime = new St.Label({style_class: "clock-desklet-label"});
        this.setContent(this._uptime);
        this.setHeader(_("Uptime"));

        this.clock = new CinnamonDesktop.WallClock();
        this.clock_notify_id = 0;

        this.settings = new Settings.DeskletSettings(this, this.metadata["uuid"], desklet_id);
        this.settings.bind("font-size", "size", this._onSettingsChanged);
        this.settings.bind("text-color", "color", this._onSettingsChanged);
    },

    _clockNotify: function(obj, pspec, data) {
        this._updateClock();
    },

    _onSettingsChanged: function(){
        this._uptime.style="font-size: " + this.size + "pt;\ncolor: " + this.color;
        this._updateClock();
    },

    on_desklet_added_to_desktop: function() {
        this._onSettingsChanged();

        if (this.clock_notify_id == 0) {
            this.clock_notify_id = this.clock.connect("notify::clock", () => this._clockNotify());
        }
    },

    on_desklet_removed: function() {
        if (this.clock_notify_id > 0) {
            this.clock.disconnect(this.clock_notify_id);
            this.clock_notify_id = 0;
        }
    },

    _updateClock: function(){
        raw_uptime = parseInt(Cinnamon.get_file_contents_utf8_sync("/proc/uptime").split(" ")[0]);
        secs = Math.floor(raw_uptime % 60);
        mins = Math.floor(raw_uptime / 60) % 60;
        hours = Math.floor(raw_uptime / 3600) % 24;
        days = Math.floor(raw_uptime / 86400);

        uptime_str = secs + " secs";
        if(raw_uptime >= 60) {
          uptime_str = mins + " mins " + uptime_str;
        }
        if(raw_uptime >= 3600) {
          uptime_str = hours + " hours " + uptime_str;
        }
        if(raw_uptime >= 86400) {
          uptime_str = days + " days " + uptime_str;
        }
        uptime_str = "Up " + uptime_str;

        this._uptime.set_text(uptime_str);
    }
}

function main(metadata, desklet_id){
    let desklet = new UptimeDesklet(metadata, desklet_id);
    return desklet;
}
