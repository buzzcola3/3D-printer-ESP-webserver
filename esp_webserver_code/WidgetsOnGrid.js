import {addLineOfcode} from "./ManageCode.js";
import {WidgetStructure} from "./widgets.js";
import {ManageGrid} from "./grid.js";
import {parseWidgetCode} from "./WidgetJsonParser.js";

export class WidgetsOnGrid{
    constructor(targetDivID, gridSegmentWidth, gridSegmentHeight, gridSegmentTopGap, gridSegmentLeftGap, sizeUnit = 'px', family = 'none'){
        this.gridSegmentWidth = gridSegmentWidth;
        this.gridSegmentHeight = gridSegmentHeight;
        this.gridSegmentTopGap = gridSegmentTopGap;
        this.gridSegmentLeftGap = gridSegmentLeftGap;
        this.targetDivID = targetDivID;
        this.sizeUnit = sizeUnit;        


        this.pushNewInstanceToList();

        let gridID = targetDivID + '_grid';
        let instance = WidgetsOnGrid.assignInstanceNumber(targetDivID)

        let gridInstance = WidgetsOnGrid.grid.instances[instance];
        this.gridInstance = gridInstance;


        //create the grid
        const parentTreeStructure = new WidgetStructure(targetDivID, gridID, ManageGrid.main.getGridEl(gridInstance));
        this.parentTreeStructure = parentTreeStructure;
        WidgetStructure.getLastestObject().divCode.id = WidgetStructure.getLastestObject().addressID;

        let gridParentObjAddr = WidgetStructure.getLastestAddress();
        gridInstance.treeStructAddr = gridParentObjAddr;
        window.onresize = WidgetsOnGrid.resizeHandler;

        WidgetsOnGrid.displayGridOnScreen(gridParentObjAddr);
    }

    static grid = {instances: [], widgetSheet: {data: [], busy: false}};
    pushNewInstanceToList(){
        WidgetsOnGrid.grid.instances.push({
            treeStructAddr: undefined,
            targetDivID: this.targetDivID,
            gridSegmentWidth: this.gridSegmentWidth,
            gridSegmentHeight: this.gridSegmentHeight,
            gridSegmentTopGap: this.gridSegmentTopGap,
            gridSegmentLeftGap: this.gridSegmentLeftGap,
            sizeUnit: this.sizeUnit,
            gridWidth: undefined,
            gridHeight: undefined,
        });
    }

    static assignInstanceNumber(targetDivID){
        let i = 0;
        
        while(1){
            if(WidgetsOnGrid.grid.instances[i].targetDivID === undefined){console.warn('instance could not be assigned'); return -1;}
            if(WidgetsOnGrid.grid.instances[i].targetDivID == targetDivID){return i;}
            i++;
        } 
    }

    static displayGridOnScreen(gridParentObjAddr){
        WidgetStructure.getAddressObj(gridParentObjAddr).display();  
    }

    static hideGridOnScreen(gridParentObjAddr){
        WidgetStructure.getAddressObj(gridParentObjAddr).hide();  
    }

    static resizeHandler(){ //mainGrid
        let i = 0;
        while(1){
            if(WidgetsOnGrid.grid.instances[i] === undefined){break;}
            //WidgetsOnGrid.grid.instances[i].DivData = ManageGrid.main.update.size(WidgetsOnGrid.grid.instances[i]);
            ManageGrid.main.update.size(WidgetsOnGrid.grid.instances[i]);
            i++;
        }
    }

    create(widget, height, width, posX, posY){
        //get position code
        //get widget code
        //combine those
        //slap it in widgetStructure

        WidgetsOnGrid.fetchWidgetDataFromJson(widget);

    }

    tempCreateTest(height = 2, width = 2, posX = 3, posY = 2){
        console.log('TEST:')
        let TLpos = {X: posX, Y: posY}
        let element = ManageGrid.create.positionClass(this.gridInstance, width, height, TLpos);

        let _ = this.gridInstance.treeStructAddr;

        let _0 = this.parentTreeStructure.createChild(_, element)
        WidgetStructure.addCode(_0, 'background-color: white');
        _0.display();

        console.log(WidgetStructure.widgetTree)
        console.log(_0)
        console.log('!TEST')
    }


    static async fetchWidgetDataFromJson(widgetName, retry = 0){
        if(WidgetsOnGrid.grid.widgetSheet.busy == true){
            retry++;
            if(retry ==  20){console.error('failed To fetch the Widget'); return;}
            setTimeout( function(){WidgetsOnGrid.fetchWidgetDataFromJson(widgetName, retry)}, 100);
            return;
        };
        console.log('fetching: ' + widgetName)
        WidgetsOnGrid.grid.widgetSheet.busy = true;

        let data = await fetch('./widgets.json')
        let out = await data.json();
        {
            if(await out[widgetName] === undefined){console.error("widget not found")}
            else{
                WidgetsOnGrid.grid.widgetSheet.busy = false;

                WidgetsOnGrid.grid.widgetSheet.data.push(out[widgetName]);
                

                return;
            }
        }
    }
}
window.WidgetsOnGrid = WidgetsOnGrid;