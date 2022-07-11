import {addLineOfcode} from "./ManageCode.js";
import {WidgetStructure} from "./widgets.js";
import {ManageGrid} from "./grid.js";
import {parseWidgetCode} from "./WidgetJsonParser.js";

let test = new WidgetStructure('mainDiv1', "widgetCreator")

let parentWidget = WidgetStructure.getLastest()
console.log(parentWidget)

let _00 = test.createChild(parentWidget);
console.log(_00)
console.log(parentWidget)

let _000 = test.createChild(_00);
console.log(_000)
console.log(parentWidget)

let _001 = test.createChild(_00);
console.log(_001)
console.log(parentWidget)

let _002 = test.createChild(_00);
console.log(_002)
console.log(parentWidget)

let _0020 = test.createChild(_002);
console.log(_0020)
console.log(parentWidget)

let _0000 = test.createChild(_000);
console.log(_0000)
console.log(parentWidget)

let _0001 = test.createChild(_000);
console.log(_0001)
console.log(parentWidget)



WidgetStructure.addCode(_0020, 'test');
WidgetStructure.getHideFunction(parentWidget);



export class WidgetsOnGrid{
    constructor(targetDivID, gridSegmentWidth, gridSegmentHeight, gridSegmentTopGap, gridSegmentLeftGap, sizeUnit = 'px', family = 'none'){
        this.gridSegmentWidth = gridSegmentWidth;
        this.gridSegmentHeight = gridSegmentHeight;
        this.gridSegmentTopGap = gridSegmentTopGap;
        this.gridSegmentLeftGap = gridSegmentLeftGap;

        let child = document.createElement('div');
        child.id = targetDivID + '_grid';

        let gridID = child.id;
        this.gridID = gridID;


        this.targetDivID = targetDivID;
        this.sizeUnit = sizeUnit;
        

        this.create = this.create;

        //todo make instance hidable (leave empty div on screen), when hidden the code is inside instance
        //make it hidden by default --> construct the whole thing inside instance (do not touch document, until finished)
        //when hiding, copy the targetDivID content to the instance var
        //when exposing, copy the instance var content to targetDivID and make the instanceVar a FUNCTION that returns the content from document

        WidgetsOnGrid.grid.instances.push({
            family: family,//{relatedTo: undefined, parentGrid: parentGrid},
            hidden: true,
            targetDivID: targetDivID,
            DivData: document.createElement('div'),
            widgetList: [],
            gridID: gridID,
            gridSegmentWidth: gridSegmentWidth,
            gridSegmentHeight: gridSegmentHeight,
            gridSegmentTopGap: gridSegmentTopGap,
            gridSegmentLeftGap: gridSegmentLeftGap,
            sizeUnit: sizeUnit,
            gridWidth: undefined,
            gridHeight: undefined,
            lastKnownPointerPosition: {X: 'unchecked', Y: 'unchecked'},
        });

        
        let instance = WidgetsOnGrid.assignInstanceNumber(targetDivID)
        this.instance = instance;
        
        let gridInstance = WidgetsOnGrid.grid.instances[instance];
        this.gridInstance = gridInstance;

        window.onresize = WidgetsOnGrid.resizeHandler;


        gridInstance.DivData = ManageGrid.main.create(gridInstance);

        WidgetsOnGrid.displayGridOnScreen(gridInstance);
        
        
    }

    static grid = {instances: [], widgetSheet: {data: [], busy: false}};

    create(widget, height, width, posX, posY){
        let newWidgetID = WidgetsOnGrid.getListId(widget, height, width, posX, posY, this.gridInstance);
        WidgetsOnGrid.fetchWidgetDataFromJson(widget, newWidgetID, this.instance);

        

        WidgetsOnGrid.createWidget(widget, newWidgetID, this.instance)
    }

    static createWidget(widget, newWidgetID, instance){
        if(WidgetsOnGrid.grid.widgetSheet.busy){
            //return;
            WidgetsOnGrid.ifBusyCallFunction(function(){WidgetsOnGrid.createWidget(widget, newWidgetID, instance)});
            return;
        }


        let gridInstance = WidgetsOnGrid.grid.instances[instance];
        //let newWidgetID = WidgetsOnGrid.getListId(widget, height, width, posX, posY, gridInstance);


            WidgetsOnGrid.checkFixInputSize(gridInstance, newWidgetID);

            let data = undefined;
            {
                data = WidgetsOnGrid.createWidgetContent(widget);
                data = WidgetsOnGrid.appendWidgetID(gridInstance, data, newWidgetID);
                data = WidgetsOnGrid.appendGridPositionClass(data, gridInstance, newWidgetID);
                //newWidgetDiv = WidgetsOnGrid.appendWidgetSize(newWidgetDiv, gridInstance.widgetList, newWidgetID);
                data = WidgetsOnGrid.appendElementAttributes(data, widget);
            }
            gridInstance.widgetList[newWidgetID].element = data;

            console.log(gridInstance.widgetList[newWidgetID].element)


            let templateSheetID = WidgetsOnGrid.findWidgetInSheet(widget);
            this.grid.widgetSheet.data[templateSheetID].jsSetup();

            WidgetsOnGrid.showWidget(gridInstance, newWidgetID);
    }

    move(targetWidgetIndex, newTopLeftPosition){
        let gridInstance = WidgetsOnGrid.grid.instances[this.instance];

        WidgetsOnGrid.updateGridPositionClass(gridInstance, targetWidgetIndex, newTopLeftPosition);
    }

    moveRelative(targetWidgetIndex, TopLeftModifiers){
        let gridInstance = WidgetsOnGrid.grid.instances[this.instance];

        let oldPosX = gridInstance.widgetList[targetWidgetIndex].TopLeftPosition.X;
        let oldPosY = gridInstance.widgetList[targetWidgetIndex].TopLeftPosition.Y;

        let newPosX = oldPosX + TopLeftModifiers.X;
        let newPosY = oldPosY + TopLeftModifiers.Y;

        let newTopLeftPosition = {X: newPosX, Y: newPosY};

        WidgetsOnGrid.updateGridPositionClass(gridInstance, targetWidgetIndex, newTopLeftPosition);
    }

    resize(targetWidgetIndex, newWidth, newHeight){
        let gridInstance = WidgetsOnGrid.grid.instances[this.instance];

        WidgetsOnGrid.updateGridSizeClass(gridInstance, targetWidgetIndex, newWidth, newHeight)
    }

    resizeRelative(targetWidgetIndex, widthModifier, heightModifier){
        let gridInstance = WidgetsOnGrid.grid.instances[this.instance];

        let newWidth = gridInstance.widgetList[targetWidgetIndex].size.width + widthModifier;
        let newHeight = gridInstance.widgetList[targetWidgetIndex].size.height + heightModifier;

        WidgetsOnGrid.updateGridSizeClass(gridInstance, targetWidgetIndex, newWidth, newHeight)
    }



    
    showGrid(){
        WidgetsOnGrid.displayGridOnScreen(this.gridInstance);

        document.getElementById(this.gridInstance.gridID).addEventListener('pointermove', (data) => {ManageGrid.get.pointerPosition(this.gridInstance, data)})
    }

    //hideGrid(){}

    showWidget(widgetID){
        let gridInsatnce = WidgetsOnGrid.grid.instances[this.instance];
        showWidget(gridInsatnce, widgetID);
    };
    static showWidget(gridInsatnce, widgetID){
        if(gridInsatnce.widgetList[widgetID].hidden == false){return;}
        document.getElementById(gridInsatnce.gridID).appendChild(gridInsatnce.widgetList[widgetID].element)
        gridInsatnce.widgetList[widgetID].hidden = false;
    }

    hideWidget(widgetID){
        let gridInsatnce = WidgetsOnGrid.grid.instances[this.instance];
        if(gridInsatnce.widgetList[widgetID].hidden == true){return;}

        document.getElementById(gridInsatnce.widgetList[widgetID].widgetID).remove();

        gridInsatnce.widgetList[widgetID].hidden = true;
    }


    static assignInstanceNumber(targetDivID){
        let i = 0;
        
        while(1){
            if(WidgetsOnGrid.grid.instances[i].targetDivID === undefined){console.warn('instance could not be assigned'); return -1;}
            if(WidgetsOnGrid.grid.instances[i].targetDivID == targetDivID){return i;}
            i++;
        } 
    }

    static getAssignedWidgetNumber(gridInstance, widgetID){
        let i = 0;
        
        while(1){
            if(gridInstance.widgetList[i].widgetID === undefined){console.warn('widget could not be assigned'); return -1;}
            if(gridInstance.widgetList[i].widgetID == widgetID){return i;}
            i++;
        } 
    }

    static resizeHandler(){ //mainGrid
        let i = 0;
        while(1){
            if(WidgetsOnGrid.grid.instances[i] === undefined){break;}
            WidgetsOnGrid.grid.instances[i].DivData = ManageGrid.main.update.size(WidgetsOnGrid.grid.instances[i]);
            i++;
        }
    }

    static appendGridPositionClass(currentClasses, instance, widgetID){
        let height = instance.widgetList[widgetID].size.height;
        let width = instance.widgetList[widgetID].size.width;
        let topLeft = instance.widgetList[widgetID].TopLeftPosition;

        //let targetCssID = 'grid_' + instance.targetDivID + '-WidgetID_' + widgetID;

    
        currentClasses = ManageGrid.create.positionClass(instance, currentClasses, width, height, topLeft);
        return currentClasses;
    }

    static updateGridPositionClass(instance, targetWidgetIndex, newTopLeftPosition,){
        let height = instance.widgetList[targetWidgetIndex].size.height;
        let width = instance.widgetList[targetWidgetIndex].size.width;
        let oldTopLeftPosition = instance.widgetList[targetWidgetIndex].TopLeftPosition;



        let targetCssID = 'grid_' + instance.targetDivID + '-WidgetID_' + targetWidgetIndex;
        let targetDivID = instance.targetDivID + '_widgetID_' + targetWidgetIndex;


        instance.widgetList[targetWidgetIndex].TopLeftPosition = ManageGrid.update.positionClass(targetDivID, targetCssID, width, height, newTopLeftPosition, oldTopLeftPosition);

        

        console.log(instance)

    
        //document.getElementById(targetCssID).classList = targetElement.classList;
    }

    static updateGridSizeClass(instance, targetWidgetIndex, newWidth, newHeight){

        let targetCssID = 'grid_' + instance.targetDivID + '-WidgetID_' + targetWidgetIndex;
        let targetDivID = instance.targetDivID + '_widgetID_' + targetWidgetIndex;

        let TopLeftPosition = instance.widgetList[targetWidgetIndex].TopLeftPosition;


        let newSize = {width: newWidth, height: newHeight};
        let oldSize = instance.widgetList[targetWidgetIndex].size;

        instance.widgetList[targetWidgetIndex].size = ManageGrid.update.sizeClass(instance, targetDivID, targetCssID, newSize, oldSize, TopLeftPosition);


        console.log(instance)

    
        //document.getElementById(targetCssID).classList = targetElement.classList;
    }



    static getListId(widget, height, width, posX, posY, instance){
        let newWidget = {
            addChild: undefined,
            family: {parentGrid: instance.targetDivID},
            widgetID: instance.targetDivID + '_widgetID_',
            hidden: true,
            element: '',
            Index: undefined,
            name: widget,
            rotated: 0,
            size: {height: height, width: width},
            TopLeftPosition: {X: posX, Y: posY,},
        }
    
        let id = 0;
        while(1){
            if(typeof instance.widgetList[id] === 'undefined' || instance.widgetList[id].Index == -1){
                newWidget.Index = id;
                newWidget.widgetID += id;
                instance.widgetList[id] = newWidget;
                break;
            }
            id++;
        }

        return id;
    }


    static widgetCode = [];

    static runWidgetCode(widgetName){
        let sheetID = WidgetsOnGrid.findWidgetInSheet(widgetName);
        console.log('widgetClicked: ' + widgetName)
        console.log(WidgetsOnGrid.grid.widgetSheet.data[sheetID].jsFunction)
        WidgetsOnGrid.grid.widgetSheet.data[sheetID].jsFunction();
    }

    static createWidgetContent(widgetName){
        let sheetID = WidgetsOnGrid.findWidgetInSheet(widgetName);
        let widgetStructure = WidgetsOnGrid.grid.widgetSheet.data[sheetID].widgetStructure();

        if(widgetStructure === undefined){return document.createElement('div');}
        return widgetStructure;
    }

    static findWidgetInSheet(widgetName){
        let i = 0;
        while(1){
            if(WidgetsOnGrid.grid.widgetSheet.data[i] === undefined){break;}
            if(WidgetsOnGrid.grid.widgetSheet.data[i].name == widgetName){return i;}
            i++;
        }
    }

    static appendWidgetID(instance, widgetData, index){
        widgetData.id = instance.widgetList[index].widgetID;
        return widgetData;
    }

    static appendElementAttributes(currentElement, widgetName){
        let sheetID = WidgetsOnGrid.findWidgetInSheet(widgetName);
        let code = WidgetsOnGrid.grid.widgetSheet.data[sheetID].divHTML

        if(code.indexOf('=') == -1){return -1;}

        let attName = code.slice(0, code.indexOf('='))

        code = code.slice(code.indexOf('=')+1)

        let endChar = 0;
        let i = 0;
        while(1){
            if(code.charAt(i) == ''){break;}
            while(1){
                if(code.charAt(i) == ''){break;}
    
                if(code.charAt(i) == '('){
                    while(1){
                        if(code.charAt(i) == ')'){break;}
                        i++;
                        if(code.charAt(i) == ''){console.warn('element attribute syntax Error'); break;}
                    }
                }
                if(code.charAt(i) == '"'){endChar = i; currentElement.setAttribute(attName, code.slice(0+1,i));}
                i++;
            }
            
            code = code.slice(endChar+1);
            i++;
        }
        return currentElement;
    }

    static displayGridOnScreen(gridInstance){
        console.log('todo')

        
        //gridInstance.DivData.appendChild()
        console.log(WidgetsOnGrid.assignInstanceNumber(gridInstance.targetDivID))

        console.log(gridInstance);

        if(gridInstance.family.parentGrid == undefined){
            document.getElementById(gridInstance.targetDivID).appendChild(gridInstance.DivData);
        }else{
            let parentGrid = gridInstance.family.parentGrid
            parentGrid = WidgetsOnGrid.assignInstanceNumber(parentGrid);
            parentGrid = WidgetsOnGrid.grid.instances[parentGrid];

            let parentWidget = gridInstance.family.childOf;
            parentWidget = WidgetsOnGrid.getAssignedWidgetNumber(parentGrid, parentWidget);

            console.log(parentGrid.widgetList[parentWidget])

            parentGrid.widgetList[parentWidget].element = (gridInstance.DivData);
        }
        

        //gridInstance.DivData.classList.
        

        gridInstance.hidden = false;
        WidgetsOnGrid.resizeHandler();
        //document.getElementById(targetElementID).appendChild(elements.div);
    }


    static checkFixInputSize(instance, widgetID){
        let template = WidgetsOnGrid.getWidgetTemplate(instance.widgetList[widgetID].name);

        console.log(template);

        let minWidth = template.sizeLimits.MinWidth;
        let maxWidth = template.sizeLimits.MaxWidth;
        let minHeight = template.sizeLimits.MinHeight;
        let maxHeight = template.sizeLimits.MaxHeight;
    
        let targetWidth = instance.widgetList[widgetID].size.width;
        let targetHeight = instance.widgetList[widgetID].size.height;
    
        if(targetWidth < minWidth){console.warn('Widget width of ' + targetWidth + ' is too small, using: ' + minWidth); targetWidth = minWidth;}
        if(targetWidth > maxWidth){console.warn('Widget width of ' + targetWidth + ' is too large, using: ' + maxWidth); targetWidth = maxWidth;}
    
        if(targetHeight < minHeight){console.warn('Widget height of ' + targetHeight + ' is too small, using: ' + minHeight); targetHeight = minHeight;}
        if(targetHeight > maxHeight){console.warn('Widget height of ' + targetHeight + ' is too large, using: ' + maxHeight); targetHeight = maxHeight;}
    
        instance.widgetList[widgetID].size.width = targetWidth;
        instance.widgetList[widgetID].size.height = targetHeight;

        //WidgetsOnGrid.checkAspectRatio(widgetList, widgetID);

        return;
    }

    static getWidgetTemplate(widgetName){
        console.log(this.grid.widgetSheet.data);

        let currentTemplate;
        let i = 0;
        while(1){
            currentTemplate = this.grid.widgetSheet.data[i];
            if(currentTemplate === undefined){return;}

            if(currentTemplate.name == widgetName){break;};
            i++;
        }
        return currentTemplate;

    }

//    static checkAspectRatio(widgetList, index){
//
//        console.log(widgetList[index].WidgetData.acceptableAspectRatios[0])
//    
//        let i = 0;
//    
//        while(1){
//            if(widgetList[index].WidgetData.acceptableAspectRatios[i] === undefined){break;}
//    
//            let targetAspectRatioWidth = widgetList[index].WidgetData.acceptableAspectRatios[i].width;
//            let targetAspectRatioHeight = widgetList[index].WidgetData.acceptableAspectRatios[i].height;
//    
//            let targetWidth = widgetList[index].size.width;
//            let targetHeight = widgetList[index].size.height;
//        
//            if(targetAspectRatioWidth/targetAspectRatioHeight == targetWidth/targetHeight){return;}
//            i++;
//        }
//    
//        console.warn('wrong aspectRatio');
//    }

    static async fetchWidgetDataFromJson(widgetName, widgetID, instanceNum, retry = 0){
        if(WidgetsOnGrid.grid.widgetSheet.busy == true){
            retry++;
            if(retry ==  20){return;}
            setTimeout( function(){WidgetsOnGrid.fetchWidgetDataFromJson(widgetName, instanceNum, retry)}, 100);
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

                let gridInstance = WidgetsOnGrid.grid.instances[instanceNum];
                let testCode = new parseWidgetCode(out[widgetName], widgetID, gridInstance);
                testCode = testCode.get();
                WidgetsOnGrid.grid.widgetSheet.data.push(testCode);
                

                return;
            }
        }
    }

    
    static ifBusyCallFunction(targetFunction, retries = 8){ //todo move to separete function
            if(retries <= 0){console.warn('unable to setup widget'); return;}
            retries--;


            if(WidgetsOnGrid.grid.widgetSheet.busy){
                setTimeout(function(){WidgetsOnGrid.ifBusyCallFunction(targetFunction, retries);}, 500);
            }
            else{
                targetFunction();
            }
    }

}
window.WidgetsOnGrid = WidgetsOnGrid;