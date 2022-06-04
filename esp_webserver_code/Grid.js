import {ManageCss} from "./ManageCss.js";


var sizeUnit = 'px';

var gridSize = {
    leftGap: 8,
    topGap: 8,
    height: 50,
    width: 50,
}

var currentGridSize = {width: undefined, height: undefined}

export var ManageGrid = {
    main: {
        modify: {
            size: function(){
                let height = ManageGrid.main.get.height();
                let width = ManageGrid.main.get.width();
                ManageGrid.main.create(height, width, 'gridStyle');
            
                currentGridSize.width = width;
                currentGridSize.height = height;
            },
        },

        create: function(height, width, parentDivId){
            let gridClass = '.grid';
            if(document.getElementById('gridStyle').innerText.includes(gridClass + '{') == true){ManageCss.byId.remove(gridClass.slice(1) + '{', parentDivId);}
        
            gridClass += '{\r';
            gridClass += 'display: grid;\r';
            gridClass += 'justify-items: center;\r';
            gridClass += 'grid-template-columns: repeat(' + width + ',' + gridSize.width + sizeUnit + ');\r';
            gridClass += 'grid-template-rows: repeat('+ height +',' + gridSize.height + sizeUnit + ');\r';
            gridClass += 'width: 100%;\r';
            gridClass += 'height: 100%;\r';
            gridClass += 'row-gap:' + gridSize.leftGap + sizeUnit + ';\r';
            gridClass += 'column-gap:' + gridSize.topGap + sizeUnit + ';\r';
            gridClass += 'overflow: auto;\r';
            gridClass += 'position: relative;\r';
            gridClass += '}\r';
        
            let grid = document.getElementById(parentDivId);
            grid.innerHTML += gridClass;
            return;
        },

        update: {
            size: function(){
                let height = ManageGrid.main.get.height();
                let width = ManageGrid.main.get.width();
                ManageGrid.main.create(height, width, 'gridStyle');
            
                currentGridSize.width = width;
                currentGridSize.height = height;
            },
        },

        get: {
            height: function(){
                let displayHeight = window.innerHeight;
                let i = 0;
                while(1){
                    if(displayHeight - (gridSize.height + gridSize.topGap) < (gridSize.height + gridSize.topGap)){break;}
                    displayHeight = displayHeight - (gridSize.height + gridSize.topGap);
                    i++;
                }
                if(displayHeight > gridSize.height + (2*gridSize.topGap)){i++;}
                return i;
            },

            width: function(){
                let displayWidth = window.innerWidth;
                let i = 0;
                while(1){
                    if(displayWidth - (gridSize.width + gridSize.leftGap) < (gridSize.width + gridSize.leftGap)){break;}
                    displayWidth = displayWidth - (gridSize.width + gridSize.leftGap);
                    i++;
                }
                if(displayWidth > gridSize.width + (2*gridSize.leftGap)){i++;}
                return i;
            },
        },
    },

    create: {
        css: {
            sizeClass: function(width, height){ //user
                let targetElementID = 'gridStyle';

                let cssCode = '.grid_' + width + 'x' + height;
            
                let name = cssCode.slice(1);
                
                if(document.getElementById(targetElementID).innerText.includes(cssCode)){return name;}
            
                cssCode += '{\r';
                cssCode += 'grid-row-span: ' + width + ';\r'; 
                cssCode += 'grid-column-span: ' + height + ';\r';
                cssCode += 'height: ' + ( (gridSize.height * height) + (gridSize.topGap * (height-1)) ) + sizeUnit + ';\r';
                cssCode += 'width: ' + ( (gridSize.width * width) + (gridSize.leftGap * (width-1)) ) + sizeUnit + ';\r';
                cssCode += '}'
            
                ManageCss.byId.create(cssCode, targetElementID);
                return name;
            },
        },
    },

    remove: {
        css: {
            sizeClass: function(gridCssClassName){
                let styleElementID = 'gridStyle';
                ManageCss.byId.remove(gridCssClassName, styleElementID);
            },
        },
    },

    get: {
        positionClass: function(TopLeftPosition, width, height){//.grid_Xmin-Xmax_Ymin-Ymax
            if(width === undefined){return undefined;}
            if(height === undefined){return undefined;}
            if(TopLeftPosition.X === undefined){return undefined;}
            if(TopLeftPosition.Y === undefined){return undefined;}
        
            let xmin = TopLeftPosition.X;
            let xmax = xmin + width;
            let ymin = TopLeftPosition.Y;
            let ymax = ymin + height;
        
            let targetElementID = 'gridStyle';
        
            
            let cssCode = '.grid_' + xmin + '-' + xmax + '_' + ymin + '-' + ymax;
            let className = cssCode.slice(1); //grid_X-X_X-X
            if(document.getElementById(targetElementID).innerText.includes(cssCode) == true){return className;}
        
        
            cssCode += '{\r';
            cssCode += 'height: ' + ( (gridSize.height * height) + (gridSize.topGap * (height-1)) ) + sizeUnit + ';\r';
            cssCode += 'width: ' + ( (gridSize.width * width) + (gridSize.leftGap * (width-1)) ) + sizeUnit + ';\r';
            cssCode += 'grid-row-start: ' + ymin + ';\r';
            cssCode += 'grid-row-end: ' + ymax + ';\r';
            cssCode += 'grid-column-start: ' + xmin + ';\r';
            cssCode += 'grid-column-end: ' + xmax + ';\r';
            cssCode += 'transition: 1s';
            cssCode += '}';
        
            ManageCss.byId.create(cssCode, targetElementID);
        
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