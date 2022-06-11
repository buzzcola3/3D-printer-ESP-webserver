import {ManageCss} from "./ManageCss.js";
import { ManageDiv } from "./ManageDiv.js";


export var ManageGrid = {
    main: {

        create: function(instance){
            ManageGrid.main.updateSizes(instance);

            let height = instance.gridHeight
            let width = instance.gridWidth 



            if (document.getElementById(instance.targetCssID) === null){
                let newEl = document.createElement('style');
                newEl.id = instance.targetCssID;
                document.getElementsByTagName('head')[0].appendChild(newEl);
            }


            let gridDiv = document.createElement('div')
            ManageDiv.passed.css.addCode(gridDiv, 'margin: 0 auto', instance.targetCssID);
            ManageDiv.passed.css.addCode(gridDiv, 'display: grid', instance.targetCssID);
            ManageDiv.passed.css.addCode(gridDiv, 'justify-items: center', instance.targetCssID);
            ManageDiv.passed.css.addCode(gridDiv, 'grid-template-columns: repeat(' + width + ',' + instance.gridSegmentWidth + instance.sizeUnit + ')', instance.targetCssID);
            ManageDiv.passed.css.addCode(gridDiv, 'grid-template-rows: repeat('+ height +',' + instance.gridSegmentHeight + instance.sizeUnit + ')', instance.targetCssID);
            ManageDiv.passed.css.addCode(gridDiv, 'row-gap:' + instance.gridSegmentLeftGap + instance.sizeUnit, instance.targetCssID);
            ManageDiv.passed.css.addCode(gridDiv, 'column-gap:' + instance.gridSegmentTopGap + instance.sizeUnit, instance.targetCssID);
            ManageDiv.passed.css.addCode(gridDiv, 'overflow: auto', instance.targetCssID);
            ManageDiv.passed.css.addCode(gridDiv, 'position: relative', instance.targetCssID);
            console.log(gridDiv)

            document.getElementById(instance.gridID).classList += gridDiv.classList;
            return;
        },

        update: {
            size: function(instance){

                let oldHeight = instance.gridHeight
                let oldWidth = instance.gridWidth

                ManageGrid.main.updateSizes(instance);

                let newHeight = instance.gridHeight
                let newWidth = instance.gridWidth


                if(oldHeight == newHeight && oldWidth == newWidth){return;}

                //console.log('grid-template-columns: repeat(' + oldWidth + ',' + instance.gridSegmentWidth + instance.sizeUnit + ')')
                //.log('grid-template-columns: repeat(' + newWidth + ',' + instance.gridSegmentWidth + instance.sizeUnit + ')')
                ManageDiv.existing.css.replaceCode('grid-template-columns: repeat(' + oldWidth + ',' + instance.gridSegmentWidth + instance.sizeUnit + ')', 'grid-template-columns: repeat(' + newWidth + ',' + instance.gridSegmentWidth + instance.sizeUnit + ')', instance.targetCssID);
                ManageDiv.existing.css.replaceCode('grid-template-rows: repeat('+ oldHeight +',' + instance.gridSegmentHeight + instance.sizeUnit + ')','grid-template-rows: repeat('+ newHeight +',' + instance.gridSegmentHeight + instance.sizeUnit + ')', instance.targetCssID);
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
        css: {
            sizeClass: function(width, height, instance){ //user
                console.log(instance.targetCssID)

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

    remove: {
        css: {
            sizeClass: function(gridCssClassName){
                let styleElementID = targetGridElement;
                ManageCss.byId.remove(gridCssClassName, styleElementID);
            },
        },
    },

    get: {
        positionClass: function(instance, TopLeftPosition, width, height){//.grid_Xmin-Xmax_Ymin-Ymax
            if(width === undefined){return undefined;}
            if(height === undefined){return undefined;}
            if(TopLeftPosition.X === undefined){return undefined;}
            if(TopLeftPosition.Y === undefined){return undefined;}
        
            let xmin = TopLeftPosition.X;
            let xmax = xmin + width;
            let ymin = TopLeftPosition.Y;
            let ymax = ymin + height;
        
            
            let cssCode = '.grid_' + xmin + '-' + xmax + '_' + ymin + '-' + ymax;
            let className = cssCode.slice(1); //grid_X-X_X-X
            if(document.getElementById(instance.targetCssID).innerText.includes(cssCode) == true){return className;}
        
        
            cssCode += '{\r';
            cssCode += 'height: ' + ( (instance.gridSegmentHeight * height) + (instance.gridSegmentTopGap * (height-1)) ) + instance.sizeUnit + ';\r';
            cssCode += 'width: ' + ( (instance.gridSegmentWidth * width) + (instance.gridSegmentLeftGap * (width-1)) ) + instance.sizeUnit + ';\r';
            cssCode += 'grid-row-start: ' + ymin + ';\r';
            cssCode += 'grid-row-end: ' + ymax + ';\r';
            cssCode += 'grid-column-start: ' + xmin + ';\r';
            cssCode += 'grid-column-end: ' + xmax + ';\r';
            cssCode += 'transition: 1s';
            cssCode += '}';
        
            ManageCss.byId.create(cssCode, instance.targetCssID);
        
            return className;
        }, 
    },
};
