/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 20.11.2019
 */
//TODO import WaltzPlatform from "/waltz";
import {codemirror_textarea} from "/waltz/resources/webix_widgets/scripting_console.js";

const kBeamtimesListPanelHeader = "<span class='webix_icon fa-table'></span> Beamtimes";
const kBeamtimesBodyHeader = "<span class='webix_icon fa-table'></span> Beamtimes";
const kBeamtimeDbApiEntryPoint = '/beamtimedb/api/beamtimes';

const pipe_output = webix.protoUI({
    name: "beamtime_output",
    update(value){
        if(!value) return;
        this.setValue(JSON.stringify(value));
        const totalLines = this.editor.lineCount();
        this.editor.autoFormatRange({line:0, ch:0}, {line:totalLines});
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
        template(obj){
            return obj.id;
        },
        on: {
            onAfterSelect(id){
                OpenAjax.hub.publish("beamtimes_list.select.id",{
                    data: {
                        id: id
                    }
                });
            }
        }
    };
}

//TODO replace with function
const beamtimes_list_ui =
    {
        rows: [
            newList()
        ]
    };

const ajax = webix.ajax;

function promiseBeamtimesIds(){
    return ajax(kBeamtimeDbApiEntryPoint)
        .then(response => response.json())
        .then(ids => ids.map(id => ({id:id})))
}

const beamtimes_list = webix.protoUI(
    {
        name: 'beamtimes_list',
        refresh(){
            promiseBeamtimesIds()
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
        },
        defaults:{
            on:{
                "left_panel_toolbar.click.refresh subscribe"(){
                    //TODO avoid this hardcoded if statement; isVisible always true
                    if($$('left_panel').getChildViews()[0] === this.getParentView() &&
                        !$$('left_panel').getChildViews()[0].config.collapsed)
                        this.refresh();
                }
            }
        }
    }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.ProgressBar, webix.IdSpace, webix.ui.layout
);

function newBeamtimesToolbar(){
    return {
        view: "toolbar",
        cols:[
            {view:"textarea",id:"query"},
            {view:"button",type:"icon",icon:"play", maxWidth:30, click(){
                this.getTopParentView().query(JSON.parse(this.getTopParentView().$$('query').getValue()))
                }}
        ]
    };
}

function newBeamtimeBody(){
    return {
        view:"beamtime_output",
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
        .post(kBeamtimeDbApiEntryPoint, JSON.stringify(query))
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
    },
    defaults:{
        on:{
            "beamtimes_list.select.id subscribe"(event){
                this.query({beamtimeId:event.data.id})
            }
        }
    }
}, TangoWebappPlatform.mixin.OpenAjaxListener, webix.ProgressBar, webix.IdSpace, webix.ui.layout);

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
