import {ManageCss, ManageWidget} from "./ManageCss.js";
import {ManageDiv} from "./ManageDiv.js";

import {addLineOfcode, removeLineOfcode, replaceLineOfCode} from "./ManageCode.js";
import { WidgetsOnGrid } from "./WidgetsOnGrid.js";

export var ManageGrid = {
    main: {

        create: function(instance){
            ManageGrid.main.updateSizes(instance);

            let height = instance.gridHeight;
            let width = instance.gridWidth;


            let gridDiv = instance.DivData

            gridDiv = addLineOfcode(gridDiv, 'margin: 0 auto');
            gridDiv = addLineOfcode(gridDiv, 'top: 50%');
            gridDiv = addLineOfcode(gridDiv, 'transform: translateY(-50%)');

            gridDiv = addLineOfcode(gridDiv, 'display: grid');
            gridDiv = addLineOfcode(gridDiv, 'justify-items: center');
            gridDiv = addLineOfcode(gridDiv, 'grid-template-columns: repeat(' + width + ',' + instance.gridSegmentWidth + instance.sizeUnit + ')');
            gridDiv = addLineOfcode(gridDiv, 'grid-template-rows: repeat('+ height +',' + instance.gridSegmentHeight + instance.sizeUnit + ')');
            gridDiv = addLineOfcode(gridDiv, 'row-gap:' + instance.gridSegmentLeftGap + instance.sizeUnit);
            gridDiv = addLineOfcode(gridDiv, 'column-gap:' + instance.gridSegmentTopGap + instance.sizeUnit);
            gridDiv = addLineOfcode(gridDiv, 'overflow: auto');
            gridDiv = addLineOfcode(gridDiv, 'position: relative');

            return gridDiv;
        },

        update: {
            size: function(instance){

                let oldHeight = instance.gridHeight
                let oldWidth = instance.gridWidth

                ManageGrid.main.updateSizes(instance);

                let newHeight = instance.gridHeight
                let newWidth = instance.gridWidth

                let newDivData = instance.DivData;

                if(oldHeight == newHeight && oldWidth == newWidth){return newDivData;}

                newDivData = replaceLineOfCode(newDivData, 'grid-template-columns: repeat(' + oldWidth + ',' + instance.gridSegmentWidth + instance.sizeUnit + ')', 'grid-template-columns: repeat(' + newWidth + ',' + instance.gridSegmentWidth + instance.sizeUnit + ')');
                newDivData = replaceLineOfCode(newDivData, 'grid-template-rows: repeat('+ oldHeight +',' + instance.gridSegmentHeight + instance.sizeUnit + ')','grid-template-rows: repeat('+ newHeight +',' + instance.gridSegmentHeight + instance.sizeUnit + ')');

                if(instance.hidden == false){

                }
                //loop through instance, and replace 
                return newDivData;
            },

        },

        get: {
            height: function(instance){
                //let displayHeight = window.innerHeight;
                let divHeight = document.getElementById(instance.targetDivID).clientHeight;
                let oneGrid = instance.gridSegmentHeight;
                let oneGap = instance.gridSegmentTopGap;

                let i = 0;
                while(1){
                    if(divHeight < oneGrid){break;}
                    divHeight = divHeight - (oneGrid + oneGap);
                    i++;
                }
                if(divHeight > instance.gridSegmentHeight + (2*instance.gridSegmentTopGap)){i++;}
                return i;
            },

            width: function(instance){
                //let displayWidth = window.innerWidth;
                let divWidth = document.getElementById(instance.targetDivID).clientWidth;
                let oneGrid = instance.gridSegmentWidth;
                let oneGap = instance.gridSegmentLeftGap;

                let i = 0;
                while(1){
                    if(divWidth < oneGrid){break;}
                    divWidth = divWidth - (oneGrid + oneGap);
                    i++;
                }
                if(divWidth > instance.gridSegmentHeight + (2*instance.gridSegmentTopGap)){i++;}
                return i;
            },

            heightPx: function(instance){
                let oneGrid = instance.gridSegmentHeight;
                let oneGap = instance.gridSegmentLeftGap;
                let gridNumber = instance.gridHeight;
                let gapNumber = gridNumber-1;

                let totalSize = (oneGap*gapNumber) + (oneGrid*gridNumber)
                return totalSize;
            },

            widthPx: function(instance){
                let oneGrid = instance.gridSegmentWidth;
                let oneGap = instance.gridSegmentTopGap;
                let gridNumber = instance.gridWidth;
                let gapNumber = gridNumber-1;

                let totalSize = (oneGap*gapNumber) + (oneGrid*gridNumber)
                return totalSize;
            },
        },

        updateSizes: function(instance){
            instance.gridHeight = ManageGrid.main.get.height(instance);
            instance.gridWidth = ManageGrid.main.get.width(instance);


            let heightPx = ManageGrid.main.get.heightPx(instance)
            let widthPx = ManageGrid.main.get.widthPx(instance)

            let unit = instance.sizeUnit;

            ManageDiv.existing.div.appendAttribute(instance.gridID, 'style', 'width: ' + widthPx + unit +'; height: ' + heightPx + unit + ';')
        },
    },

    create: {

        positionClass: function(instance, targetElements, targetCssID, width, height, TopLeftPosition){
            if(width === undefined){return undefined;}
            if(height === undefined){return undefined;}
            if(TopLeftPosition.X === undefined){return undefined;}
            if(TopLeftPosition.Y === undefined){return undefined;}
        
            let xmin = TopLeftPosition.X;
            let xmax = xmin + width;
            let ymin = TopLeftPosition.Y;
            let ymax = ymin + height;

            let widthPx = instance.gridSegmentWidth * width;
            let heightPx = instance.gridSegmentHeight * height;
            let leftGapPx = instance.gridSegmentLeftGap * (width-1);
            let topGapPx = instance.gridSegmentTopGap * (height-1);

        

            ManageDiv.passed.css.addCode(targetElements.div, 'height: ' + (heightPx + topGapPx) + instance.sizeUnit, targetElements.css);
            ManageDiv.passed.css.addCode(targetElements.div, 'width: ' + (widthPx + leftGapPx) + instance.sizeUnit, targetElements.css);
            ManageDiv.passed.css.addCode(targetElements.div, 'grid-row-start: ' + ymin, targetElements.css);
            ManageDiv.passed.css.addCode(targetElements.div, 'grid-row-end: ' + ymax, targetElements.css);
            ManageDiv.passed.css.addCode(targetElements.div, 'grid-column-start: ' + xmin, targetElements.css);
            ManageDiv.passed.css.addCode(targetElements.div, 'grid-column-end: ' + xmax, targetElements.css);
            ManageDiv.passed.css.addCode(targetElements.div, 'transition: 1s', targetElements.css);
        
            return targetElements;
        }, 

        css: {
            sizeClass: function(width, height, instance){ //user

                let cssCode = '.grid_' + width + 'x' + height;
            
                let name = cssCode.slice(1);
                
                if(document.getElementById(instance.targetCssID).innerText.includes(cssCode)){return name;}
            
                cssCode += '{\r';
                cssCode += 'grid-row-span: ' + width + ';\r'; 
                cssCode += 'grid-column-span: ' + height + ';\r';
                cssCode += 'height: ' + ( (instance.gridSegmentHeight * height) + (instance.gridSegmentTopGap * (height-1)) ) + instance.sizeUnit + ';\r';
                cssCode += 'width: ' + ( (instance.gridSegmentWidth * width) + (instance.gridSegmentLeftGap * (width-1)) ) + instance.sizeUnit + ';\r';
                cssCode += '}'
            
                ManageCss.byId.create(cssCode, instance.targetCssID);
                return name;
            },
        },
    },

    update: {
        positionClass: function(targetDivID, targetCssID, width, height, newTopLeftPosition, oldTopLeftPosition){

            console.log(oldTopLeftPosition)
            console.log(newTopLeftPosition)
            let oldXmin = oldTopLeftPosition.X;
            let oldXmax = oldXmin + width;
            let oldYmin = oldTopLeftPosition.Y;
            let oldYmax = oldYmin + height;

            let newXmin = newTopLeftPosition.X;
            let newXmax = newXmin + width;
            let newYmin = newTopLeftPosition.Y;
            let newYmax = newYmin + height;

            if(oldYmin != newYmin){
                ManageWidget.cssCode.remove(targetDivID, 'grid-row-start: ' + oldYmin, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'grid-row-start: ' + newYmin, targetCssID);
            }

            if(oldYmax != newYmax){
                ManageWidget.cssCode.remove(targetDivID, 'grid-row-end: ' + oldYmax, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'grid-row-end: ' + newYmax, targetCssID);
            }

            if(oldXmin != newXmin){
                ManageWidget.cssCode.remove(targetDivID, 'grid-column-start: ' + oldXmin, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'grid-column-start: ' + newXmin, targetCssID);
            }

            if(oldXmax != newXmax){
                ManageWidget.cssCode.remove(targetDivID, 'grid-column-end: ' + oldXmax, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'grid-column-end: ' + newXmax, targetCssID);
            }

            return newTopLeftPosition;
        },

        sizeClass: function(instance, targetDivID, targetCssID, newSize, oldSize, TopLeftPosition){

            console.log(oldSize);
            let newWidth = newSize.width;
            let newHeight = newSize.height;

            let oldWidth = oldSize.width;
            let oldHeight = oldSize.height;

            let oldXmax = TopLeftPosition.X + oldWidth;
            let oldYmax = TopLeftPosition.Y + oldHeight;
            let newXmax = TopLeftPosition.X + newWidth;
            let newYmax = TopLeftPosition.Y + newHeight;

            let oldWidthPx = instance.gridSegmentWidth * oldWidth;
            let oldHeightPx = instance.gridSegmentHeight * oldHeight;
            let oldLeftGapPx = instance.gridSegmentLeftGap * (oldWidth-1);
            let oldTopGapPx = instance.gridSegmentTopGap * (oldHeight-1);

            let newWidthPx = instance.gridSegmentWidth * newWidth;
            let newHeightPx = instance.gridSegmentHeight * newHeight;
            let newLeftGapPx = instance.gridSegmentLeftGap * (newWidth-1);
            let newTopGapPx = instance.gridSegmentTopGap * (newHeight-1);

            if(newWidth != oldWidth){
                ManageWidget.cssCode.remove(targetDivID, 'width: ' + (oldWidthPx + oldLeftGapPx) + instance.sizeUnit, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'width: ' + (newWidthPx + newLeftGapPx) + instance.sizeUnit, targetCssID);
            }

            if(newHeight != oldHeight){
                ManageWidget.cssCode.remove(targetDivID, 'height: ' + (oldHeightPx + oldTopGapPx) + instance.sizeUnit, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'height: ' + (newHeightPx + newTopGapPx) + instance.sizeUnit, targetCssID);
            }

            if(oldYmax != newYmax){
                ManageWidget.cssCode.remove(targetDivID, 'grid-row-end: ' + oldYmax, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'grid-row-end: ' + newYmax, targetCssID);
            }

            if(oldXmax != newXmax){
                ManageWidget.cssCode.remove(targetDivID, 'grid-column-end: ' + oldXmax, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'grid-column-end: ' + newXmax, targetCssID);
            }

            return {width: newWidth, height: newHeight};

        },
    },

    remove: {
        css: {
            sizeClass: function(gridCssClassName){
                let styleElementID = targetGridElement;
                ManageCss.byId.remove(gridCssClassName, styleElementID);
            },
        },
    },

    get: {
        pointerPosition: function(instance, moveData){

            let gridHeightPx = ManageGrid.main.get.heightPx(instance)
            let gridWidthPx = ManageGrid.main.get.widthPx(instance)

            let gridHeight = instance.gridHeight;
            let gridWidth = instance.gridWidth;

            let gridSegmentHeight = instance.gridSegmentHeight;
            let gridSegmentWidth = instance.gridSegmentWidth;

            let gridTopGap = instance.gridSegmentTopGap;
            let gridLeftGap = instance.gridSegmentLeftGap;

            let Y = moveData.layerY;
            Y = Y + (gridHeightPx/2)

            let X = moveData.layerX

            let cursorPointer = { X: -1, Y: -1}

            let i = 0;
            while(1){
                if(i > (gridWidth)-1){i = -1; break;}
                //if(x<50+(i*58) && x>0+(i*58)){gridPos.X = (i+1); break;}
                if(X<gridSegmentWidth+(i*(gridSegmentWidth+gridLeftGap)) && X>0+(i*(gridSegmentWidth+gridLeftGap))){i = (i+1); break;} //lol
                i++;
            }
            cursorPointer.X = i;

            i = 0;
            while(1){
                if(i > (gridHeight)-1){i = -1; break;}
                //if(x<50+(i*58) && x>0+(i*58)){gridPos.X = (i+1); break;}
                if(Y<gridSegmentHeight+(i*(gridSegmentHeight+gridTopGap)) && Y>0+(i*(gridSegmentHeight+gridTopGap))){i = (i+1); break;} //lol
                i++;
            }
            cursorPointer.Y = i;

            if(cursorPointer.X != -1 && cursorPointer.Y != -1){instance.lastKnownPointerPosition = cursorPointer;} 
        }
    },
};
