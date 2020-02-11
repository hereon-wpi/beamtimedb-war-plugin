/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 20.11.2019
 */
//TODO import WaltzPlatform from "/waltz";
import {EventBus} from "/eventbus/index.js";
import filter from "./beamtimes_filter.js";
import newSearch from "/waltz/resources/webix_widgets/search.js";
import {codemirror_textarea} from "/waltz/resources/webix_widgets/scripting_console.js";

const kBeamtimesListPanelHeader = "<span class='webix_icon mdi mdi-table'></span> Beamtimes";
const kBeamtimesBodyHeader = "<span class='webix_icon mdi mdi-table'></span> Beamtimes";
const kBeamtimeDbApiEntryPoint = '/beamtimedb/api/beamtimes';

//TODO prevent global scope
RegExp.prototype.toJSON = function(){
    return {
        $regex: this.source,
        $options: this.flags
    }
};

//TODO define this global object in waltz platform and inject here
const eventbus = new EventBus();

const kBeamtimesChannel = "beamtimes";

const json_textarea = webix.protoUI({
    name: "json_textarea",
    /**
     *
     * @return {object} non-strict json object
     */
    getValue: function () {
        return eval(`(function(){const q = {${this.editor.getValue()}}; return q;})();`);
    },
    /**
     *
     * @param {object|any} value
     */
    update(value){
        if(!value) return;
        this.setValue(JSON.stringify(value));
        const totalLines = this.editor.lineCount();
        this.editor.autoFormatRange({line: 0, ch: 0}, {line: totalLines});
    },
    $init(config){
        config.mode = "application/json"
    }
},codemirror_textarea);

function newList(){
    return {
        view: "list",
        id: "list",
        select:true,
        type: {
            height: "auto"
        },
        template(obj){
            return `<ul>
                    <li>Applicant: ${obj.applicant}</li>
                    <li>Principle Investigator: ${obj.pi}</li>
                    <li>Leader: ${obj.leader}</li>
                    <li>Id: ${obj.beamtimeId}</li>
                    </ul>`;
        },
        scheme: {
            $init(obj) {
                for (const property in obj) {
                    obj[`${property}_lower`] = obj[property].toLowerCase();
                }
            }
        },
        on: {
            onItemClick(id){
                const beamtime = this.getItem(id);
                eventbus.publish("beamtimes_list.select.id", {
                    data: {
                        id: beamtime.beamtimeId
                    }
                }, kBeamtimesChannel);
            }
        }
    };
}

//TODO replace with function
const beamtimes_list_ui =
    {
        rows: [
            newSearch("list", filter),
            newList()
        ]
    };

const ajax = webix.ajax;

function promiseBeamtimes() {
    return ajax(kBeamtimeDbApiEntryPoint)
        .then(response => response.json())
}

const beamtimes_list = webix.protoUI(
    {
        name: 'beamtimes_list',
        refresh(){
            promiseBeamtimes()
                .then(ids => {
                    this.$$('list').clearAll();
                    this.$$('list').parse(ids);
                })
        },
        save(){
            return false;
        },
        /**
         * @constructs
         * @memberof ui.DeviceViewPanel.DevicePanelPipes
         */
        $init: function (config) {
            webix.extend(config, beamtimes_list_ui);
            this.$ready.push(() => {
                this.refresh();
            });

            this.$ready.push(() => {
                eventbus.subscribe("left_panel_toolbar.click.refresh", (event) => {
                    if($$('left_panel').getChildViews()[0] === this.getParentView() &&
                        !$$('left_panel').getChildViews()[0].config.collapsed)
                        this.refresh();
                }, kBeamtimesChannel);
            });
        }
    }, webix.ProgressBar, webix.IdSpace, webix.ui.layout
);

function newBeamtimesToolbar(){
    return {
        view: "toolbar",
        cols:[
            {view:"json_textarea",id:"query"},
            {view:"button",type:"icon",icon:"mdi mdi-play", maxWidth:30, click(){
                this.getTopParentView().query(this.getTopParentView().$$('query').getValue())
                }}
        ]
    };
}

function newBeamtimeBody(){
    return {
        view:"json_textarea",
        id: "output"
    }
}

function newBeamtimesBodyUI(){
    return {
        rows:[
            newBeamtimesToolbar(),
            newBeamtimeBody()
        ]
    }
}

function promiseBeamtimesBy(query){
    return ajax().headers({
            "Content-type": "application/json"
        })
        .post(kBeamtimeDbApiEntryPoint, query)
        .then(response => response.json())

}

const beamtimes_body = webix.protoUI({
    name: 'beamtimes_body',
    query(query){
        promiseBeamtimesBy(query)
            .then(beamtimes => this.$$('output').update(beamtimes.map(beamtime => JSON.parse(beamtime))))
    },
    $init(config){
        webix.extend(config, newBeamtimesBodyUI())

        this.$ready.push(() => {
            eventbus.subscribe("beamtimes_list.select.id", (event) => {
                this.query({beamtimeId:event.data.id})
            }, kBeamtimesChannel);
        });
    }
}, webix.ProgressBar, webix.IdSpace, webix.ui.layout);

export function newBeamtimeDbIdsList(){
    return {
        header: kBeamtimesListPanelHeader,
        width: 300,
        body: {
            view: 'beamtimes_list',
            id: 'beamtimes_list'
        }
    };
}

export function newBeamtimesBody(){
    return {
        header: kBeamtimesBodyHeader,
        borderless: true,
        body: {
            view: 'beamtimes_body',
            id: 'beamtimes'
        }
    };
}
