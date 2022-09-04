import {addLineOfcode} from "./ManageCode.js";
import {WidgetStructure} from "./widgets.js";
import {ManageGrid} from "./grid.js";
import {WidgetJsonParser} from "./WidgetJsonParser.js";

export class WidgetsOnGrid{
    constructor(targetDivID, gridSegmentWidth, gridSegmentHeight, gridSegmentTopGap, gridSegmentLeftGap, sizeUnit = 'px'){
        let gridSizes = {};
        
        gridSizes.gridSegmentWidth = gridSegmentWidth;
        gridSizes.gridSegmentHeight = gridSegmentHeight;
        gridSizes.gridSegmentTopGap = gridSegmentTopGap;
        gridSizes.gridSegmentLeftGap = gridSegmentLeftGap;
        gridSizes.targetDivID = targetDivID;
        gridSizes.sizeUnit = sizeUnit;

        this.gridSizes = gridSizes;


        let gridID = targetDivID + '_grid';


        //create new structure with grid as root element
        const gridMainClassOfTreeStructure = new WidgetStructure(targetDivID, gridID, ManageGrid.main.getGridEl(gridSizes));
        this.gridMainClassOfTreeStructure = gridMainClassOfTreeStructure;

        //get the root element
        let gridParentObj = WidgetStructure.getLastestObject();
        gridParentObj.divCode.id = gridParentObj.addressID;
        gridParentObj.gridSizes = gridSizes;
        this.gridParentObj = gridParentObj;

        //add to list of grids
        WidgetsOnGrid.gridList.push(gridParentObj.address);

        
        window.onresize = WidgetsOnGrid.resizeHandler;

        gridParentObj.display();

        //console.log(WidgetStructure.widgetTree);
        console.log(WidgetsOnGrid.gridList);
    }

    static appendSubGridCode(targetObj, gridSegmentWidth, gridSegmentHeight, gridSegmentTopGap, gridSegmentLeftGap, sizeUnit = 'px'){
        let gridSizes = {};
        if((targetObj.gridSizes === undefined) == 0){gridSizes = targetObj.gridSizes}

        gridSizes.gridSegmentWidth = gridSegmentWidth;
        gridSizes.gridSegmentHeight = gridSegmentHeight;
        gridSizes.gridSegmentTopGap = gridSegmentTopGap;
        gridSizes.gridSegmentLeftGap = gridSegmentLeftGap;
        gridSizes.targetDivID = targetObj.addressID;
        gridSizes.sizeUnit = sizeUnit;

        this.gridSizes = gridSizes;

        targetObj.gridSizes = gridSizes;

        ManageGrid.main.getGridEl(gridSizes, targetObj.divCode)

        console.log(targetObj.divCode.className)

        //if(classText.includes('width__') && classText.includes('height__')){return targetObj;}
        
        WidgetsOnGrid.gridList.push(targetObj.address);

        return targetObj;
    }

    static gridList = [] //stores element ID of each grid

    static grid = {instances: [], widgetSheet: {data: [], busy: false}};

    static resizeHandler(){ //mainGrid
        WidgetsOnGrid.gridList.forEach((gridAddr) => {
            ManageGrid.update.size(WidgetStructure.getAddressObj(gridAddr))
            //ManageGrid.update.updateElementSize(WidgetStructure.getAddressObj(gridAddr))
            //ManageGrid.update.updateGridElementSize(WidgetStructure.getAddressObj(gridAddr))
            //ManageGrid.main.update.size(WidgetStructure.getAddressObj(gridAddr), WidgetStructure.getAddressObj(gridAddr).gridSizes);
        })
    }

    createWidget(widget, height, width, posX, posY){

        //fetch widget

        //prepare
        WidgetsOnGrid.fetchWidgetDataFromJson(widget, this.gridParentObj, height, width, {X: posX, Y: posY});

        //let _0 = WidgetsOnGrid.cw_createEmptyChild(this.gridParentObj, width, height, {X:posX, Y:posY})
    
        //ManageGrid.create.positionClass(this.gridSizes, width, height, {X:posX, Y:posY}, _0.divCode) //remove grid sizes --> SEARCH FOR PARENT WITH gridSizes and apply it
        //WidgetsOnGrid.cw_createEmptyObject(this.gridParentObj, width, height, {X:posX, Y:posY})

        //let _00 = WidgetsOnGrid.cw_createGridChild(_0);

        //let _000 = WidgetsOnGrid.cw_createEmptyChild(_00, 1, 1, {X:1, Y:1})

        //let _0000 = WidgetsOnGrid.cw_createGridChild(_000, {gridSegmentHeight: 22, gridSegmentWidth: 22, gridSegmentTopGap: 3, gridSegmentLeftGap: 3, sizeUnit: 'px'})

        
        //console.log(_0.address.toString());
        //console.log(_00.address.toString());

        //_0.display();

    }

    static cw_createGridChild(addressObj, gridSize = WidgetsOnGrid.inheritGridSize(addressObj)){
        let childObj = WidgetStructure.createChild(addressObj.address);
        WidgetsOnGrid.appendSubGridCode(childObj, gridSize.gridSegmentWidth, gridSize.gridSegmentHeight, gridSize.gridSegmentTopGap, gridSize.gridSegmentLeftGap);
        return childObj
    }

    static cw_addGridCode(addressObj, gridSize = WidgetsOnGrid.inheritGridSize(addressObj)){
        WidgetsOnGrid.appendSubGridCode(addressObj, gridSize.gridSegmentWidth, gridSize.gridSegmentHeight, gridSize.gridSegmentTopGap, gridSize.gridSegmentLeftGap);
        return addressObj;
    }

    static cw_createEmptyChild(addressObj, width, height, topLeft,){
        let childObj = WidgetStructure.createChild(addressObj.address)
        ManageGrid.create.positionClass(WidgetsOnGrid.inheritGridSize(childObj), width, height, topLeft, childObj)
        return childObj;
    }

    static cw_addCode(addressObj, code){
        return WidgetStructure.addCode(addressObj, code);
    }

    static inheritGridSize(currentObject){ //get gridsize of the parent, if it doesnt have gridSize get the gridSize of it's parent
        console.log(currentObject)
        let address = currentObject.address.concat([]);
        address.pop();
        if(address.length == 0){console.warn("Unable to inherit size, attempting to return current size"); return currentObject.gridSizes;}

        while(WidgetStructure.getAddressObj(address).gridSizes === undefined){address.pop()}

        return getAddressObj(address).gridSizes;
    }

    static example_widget = {
        customGridSize: undefined,
        widthInGrid: 1,
        heightInGrid: 2,
        position: {X:3, Y:4},
        construction: undefined

    }

    static async fetchWidgetDataFromJson(widgetName, parentObj, height, width, topLeft, retry = 0){
        if(WidgetsOnGrid.grid.widgetSheet.busy == true){
            retry++;
            if(retry ==  20){console.error('failed To fetch the Widget'); return;}
            setTimeout( function(){WidgetsOnGrid.fetchWidgetDataFromJson(widgetName, parentObj, height, width, topLeft, retry)}, 100);
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

                let _0 = WidgetsOnGrid.cw_createEmptyChild(parentObj, width, height, topLeft)


                WidgetJsonParser.parse(_0, out[widgetName]);
                

                _0.display();
                

                return;
            }
        }
    }
}
window.WidgetsOnGrid = WidgetsOnGrid;