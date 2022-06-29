import {ManageCss} from "./ManageCss.js";
import {ManageDiv} from "./ManageDiv.js";
import {ManageGrid} from "./grid.js";
import {parseWidgetCode} from "./WidgetJsonParser.js";



export class WidgetsOnGrid{
    constructor(targetDivID, gridSegmentWidth, gridSegmentHeight, gridSegmentTopGap, gridSegmentLeftGap, sizeUnit = 'px'){
        this.gridSegmentWidth = gridSegmentWidth;
        this.gridSegmentHeight = gridSegmentHeight;
        this.gridSegmentTopGap = gridSegmentTopGap;
        this.gridSegmentLeftGap = gridSegmentLeftGap;

        let child = document.createElement('div');
        child.id = targetDivID + '_grid';
        document.getElementById(targetDivID).appendChild(child)

        let gridID = child.id;
        this.gridID = gridID;


        this.targetDivID = targetDivID;
        this.sizeUnit = sizeUnit;
        
        let targetCssID = 'gridStyle_' + targetDivID;
        this.targetCssID = targetCssID;

        this.create = this.create;

        //todo make instance hidable (leave empty div on screen), when hidden the code is inside instance
        //make it hidden by default --> construct the whole thing inside instance (do not touch document, until finished)
        //when hiding, copy the targetDivID content to the instance var
        //when exposing, copy the instance var content to targetDivID and make the instanceVar a FUNCTION that returns the content from document

        WidgetsOnGrid.grid.instances.push({
            hidden: true,
            targetDivID: targetDivID,
            DivData: undefined,
            targetCssID: targetCssID,
            CssData: undefined,
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

        window.onresize = WidgetsOnGrid.resizeHandler;
        document.getElementById(gridID).addEventListener('pointermove', (data) => {ManageGrid.get.pointerPosition(gridInstance, data)})

        let data = ManageGrid.main.create(gridInstance);
        gridInstance.DivData = data.gridDiv;
        gridInstance.CssData = data.gridCss;

        console.log(gridInstance);
    }

    static grid = {instances: [], widgetSheet: {data: [], busy: false}};

    create(widget, height, width, posX, posY){
        WidgetsOnGrid.fetchWidgetDataFromJson(widget, this.instance);
        WidgetsOnGrid.createWidget(widget, height, width, posX, posY, this.instance)
    }
    static createWidget(widget, height, width, posX, posY, instance){
        if(WidgetsOnGrid.grid.widgetSheet.busy){
            //return;
            WidgetsOnGrid.ifBusyCallFunction(function(){WidgetsOnGrid.createWidget(widget, height, width, posX, posY, instance)});
            return;
        }


        let gridInstance = WidgetsOnGrid.grid.instances[instance];
        let newWidgetID = WidgetsOnGrid.getListId(widget, height, width, posX, posY, gridInstance);


            WidgetsOnGrid.checkFixInputSize(gridInstance, newWidgetID);

            let newWidgetDiv;
            newWidgetDiv = WidgetsOnGrid.createWidgetContent(widget);
            newWidgetDiv = WidgetsOnGrid.appendWidgetID(gridInstance, newWidgetDiv, newWidgetID);
            newWidgetDiv = WidgetsOnGrid.appendGridPositionClass(newWidgetDiv, gridInstance, newWidgetID);
            //newWidgetDiv = WidgetsOnGrid.appendWidgetSize(newWidgetDiv, gridInstance.widgetList, newWidgetID);
            newWidgetDiv = WidgetsOnGrid.appendElementAttributes(newWidgetDiv, widget);
            WidgetsOnGrid.placeDivOnScreen(newWidgetDiv, gridInstance.gridID);

            let templateSheetID = WidgetsOnGrid.findWidgetInSheet(widget);
            this.grid.widgetSheet.data[templateSheetID].jsSetup();
        
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




    static assignInstanceNumber(targetDivID){
        let i = 0;
        
        while(1){
            if(WidgetsOnGrid.grid.instances[i].targetDivID === undefined){console.warn('instance could not be assigned'); return -1;}
            if(WidgetsOnGrid.grid.instances[i].targetDivID == targetDivID){return i;}
            i++;
        }
        
    }

    static resizeHandler(){ //mainGrid
        let i = 0;
        while(1){
            if(WidgetsOnGrid.grid.instances[i] === undefined){break;}
            ManageGrid.main.update.size(WidgetsOnGrid.grid.instances[i]);
            i++;
        }
    }

    static appendGridPositionClass(targetElement, instance, index){
        let height = instance.widgetList[index].size.height;
        let width = instance.widgetList[index].size.width;
        let topLeft = instance.widgetList[index].TopLeftPosition;

        let targetCssID = 'grid_' + instance.targetDivID + '-WidgetID_' + index;
    
        targetElement = ManageGrid.create.positionClass(instance, targetElement, targetCssID, width, height, topLeft);
        return targetElement;
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

    static appendWidgetID(instance, currentDiv, index){
        currentDiv.id = instance.targetDivID + '_widgetID_' + index;
        return currentDiv;
    }

    static appendElementAttributes(currentDiv, widgetName){
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
                if(code.charAt(i) == '"'){endChar = i; currentDiv.setAttribute(attName, code.slice(0+1,i));}
                i++;
            }
            
            code = code.slice(endChar+1);
            i++;
        }
        return currentDiv;
    }

    static placeDivOnScreen(currentDiv, targetElementID){
        document.getElementById(targetElementID).appendChild(currentDiv);
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

    static async fetchWidgetDataFromJson(widgetName, instanceNum, retry = 0){
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
                let testCode = new parseWidgetCode(out[widgetName], gridInstance);
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
window.ManageDiv = ManageDiv;