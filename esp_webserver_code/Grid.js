import {ManageCss} from "./ManageCss.js";


var sizeUnit = 'px';

var gridSize = {
    leftGap: 8,
    topGap: 8,
    height: 50,
    width: 50,
}

var targetGridElement = 'gridStyle';

var currentGridSize = {width: undefined, height: undefined}

export var ManageGrid = {
    main: {

        create: function(parentDivId, targetCssID, gridSegmentWidth, gridSegmentHeight, gridSegmentTopGap, gridSegmentLeftGap, sizeUnit = 'px'){
            let height = ManageGrid.main.get.height(parentDivId, gridSegmentHeight, gridSegmentTopGap);
            let width = ManageGrid.main.get.width(parentDivId,  gridSegmentWidth, gridSegmentLeftGap);

            if (document.getElementById(targetCssID) === null){
                let newEl = document.createElement('style');
                newEl.id = targetCssID;
                document.getElementsByTagName('head')[0].appendChild(newEl);
            }

            let gridClass = '.grid_' + parentDivId;
            let cssClassName = gridClass.slice(1);

            if(document.getElementById(targetCssID).innerText.includes(gridClass + '{') == true){ManageCss.byId.remove(gridClass.slice(1) + '{', targetCssID);}
        
            gridClass += '{\r';
            gridClass += 'display: grid;\r';
            gridClass += 'justify-items: center;\r';
            gridClass += 'grid-template-columns: repeat(' + width + ',' + gridSegmentWidth + sizeUnit + ');\r';
            gridClass += 'grid-template-rows: repeat('+ height +',' + gridSegmentHeight + sizeUnit + ');\r';
            gridClass += 'width: 100%;\r';
            gridClass += 'height: 100%;\r';
            gridClass += 'row-gap:' + gridSegmentLeftGap + sizeUnit + ';\r';
            gridClass += 'column-gap:' + gridSegmentTopGap + sizeUnit + ';\r';
            gridClass += 'overflow: auto;\r';
            gridClass += 'position: relative;\r';
            gridClass += '}\r';
        
            let grid = document.getElementById(targetCssID);
            gridClass += grid.innerHTML;
            grid.innerHTML = gridClass;

            //grid.innerHTML += gridClass;
            console.log(document.getElementById(targetCssID))

            document.getElementById(parentDivId).classList.add(cssClassName);
            return cssClassName;
        },

        update: {
            size: function(parentDivId, targetCssID, gridSegmentWidth, gridSegmentHeight, gridSegmentTopGap, gridSegmentLeftGap, sizeUnit){

                let height = ManageGrid.main.get.height(parentDivId, gridSegmentHeight, gridSegmentTopGap);
                let width = ManageGrid.main.get.width(parentDivId, gridSegmentWidth, gridSegmentLeftGap);

                ManageGrid.main.create(parentDivId, targetCssID, gridSegmentWidth, gridSegmentHeight, gridSegmentTopGap, gridSegmentLeftGap, sizeUnit);
            
                currentGridSize.width = width;
                currentGridSize.height = height;
            },
        },

        get: {
            height: function(elementID, gridSegmentHeight, gridSegmentTopGap){
                //let displayHeight = window.innerHeight;
                let displayHeight = document.getElementById(elementID).clientHeight;
                let i = 0;
                while(1){
                    if(displayHeight - (gridSegmentHeight + gridSegmentTopGap) < (gridSegmentHeight + gridSegmentTopGap)){break;}
                    displayHeight = displayHeight - (gridSegmentHeight + gridSegmentTopGap);
                    i++;
                }
                if(displayHeight > gridSegmentHeight + (2*gridSegmentTopGap)){i++;}
                return i;
            },

            width: function(elementID, gridSegmentWidth, gridSegmentLeftGap){
                //let displayWidth = window.innerWidth;
                let displayWidth = document.getElementById(elementID).clientWidth;
                let i = 0;
                while(1){
                    if(displayWidth - (gridSegmentWidth + gridSegmentLeftGap) < (gridSegmentWidth + gridSegmentLeftGap)){break;}
                    displayWidth = displayWidth - (gridSegmentWidth + gridSegmentLeftGap);
                    i++;
                }
                if(displayWidth > gridSegmentWidth + (2*gridSegmentLeftGap)){i++;}
                return i;
            },
        },
    },

    create: {
        css: {
            sizeClass: function(width, height, gridSegmentWidth, gridSegmentHeight, gridSegmentLeftGap, gridSegmentTopGap, targetCssID){ //user
                console.log(targetCssID)

                let cssCode = '.grid_' + width + 'x' + height;
            
                let name = cssCode.slice(1);
                
                if(document.getElementById(targetCssID).innerText.includes(cssCode)){return name;}
            
                cssCode += '{\r';
                cssCode += 'grid-row-span: ' + width + ';\r'; 
                cssCode += 'grid-column-span: ' + height + ';\r';
                cssCode += 'height: ' + ( (gridSegmentHeight * height) + (gridSegmentTopGap * (height-1)) ) + sizeUnit + ';\r';
                cssCode += 'width: ' + ( (gridSegmentWidth * width) + (gridSegmentLeftGap * (width-1)) ) + sizeUnit + ';\r';
                cssCode += '}'
            
                ManageCss.byId.create(cssCode, targetCssID);
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
        positionClass: function(parentStyleId, TopLeftPosition, width, height, gridSegmentWidth, gridSegmentHeight, gridSegmentLeftGap, gridSegmentTopGap){//.grid_Xmin-Xmax_Ymin-Ymax
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
            if(document.getElementById(parentStyleId).innerText.includes(cssCode) == true){return className;}
        
        
            cssCode += '{\r';
            cssCode += 'height: ' + ( (gridSegmentHeight * height) + (gridSegmentTopGap * (height-1)) ) + sizeUnit + ';\r';
            cssCode += 'width: ' + ( (gridSegmentWidth * width) + (gridSegmentLeftGap * (width-1)) ) + sizeUnit + ';\r';
            cssCode += 'grid-row-start: ' + ymin + ';\r';
            cssCode += 'grid-row-end: ' + ymax + ';\r';
            cssCode += 'grid-column-start: ' + xmin + ';\r';
            cssCode += 'grid-column-end: ' + xmax + ';\r';
            cssCode += 'transition: 1s';
            cssCode += '}';
        
            ManageCss.byId.create(cssCode, parentStyleId);
        
            return className;
        }, 
    },
};

export function SetupSize(sizeObj){
    gridSize = sizeObj;
}

export function SetupSizeUnit(str){
    sizeUnit = str;
}