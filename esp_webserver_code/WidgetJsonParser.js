import { WidgetsOnGrid } from "./WidgetsOnGrid.js";


export class WidgetJsonParser{
    
    //cw_createGridChild
    //cw_createEmptyChild
    
    //take in the JSON widget object, parse ==> setup ==> create 
    static parse(widgetObj, widgetJsonObject = this.getUnknownWidget()){

        if(widgetJsonObject.widgetStructure == undefined){console.error("invalid JSON"); return}

        this.widgetStructureParser(widgetJsonObject, widgetObj);
        
    }

    //returns widget that is empty saying "unknown"
    static getUnknownWidget(){
        return;
    }


    static widgetStructureParser(widgetJsonObject, widgetObj){
        let rawString = widgetJsonObject.widgetStructure;

        let codeArray = this.widgetStructStrToArrOfFunctions(rawString);

        codeArray.forEach(lineOfCode => {
            this.structureBuilder(lineOfCode, widgetObj);
        })
    }

    //takes in a string, spits out an array
    static widgetStructStrToArrOfFunctions(structString){

        let codeArray = [];
        while(structString.includes('$/$')){

            structString = structString.slice(structString.indexOf('$/$') + 3);


            let funArguments = this.findBracketEnd('(', structString);
            let funFun = structString.slice(0, structString.indexOf('$/$'))

            structString = structString.slice(structString.indexOf(';')+1)

            //remove brackets
            funArguments = funArguments.substring(1, funArguments.length-1);

            //remove '
            if(funArguments.charAt(0) == "'" && funArguments.charAt(funArguments.charAt(-1))){
                funArguments = funArguments.substring(1, funArguments.length-1);
            }

            codeArray.push({type: funFun, arguments: funArguments})
        }

        console.log(codeArray);
        return codeArray
    }

    //finds the first bracket of the given type and returns string thats in between ()->included
    static findBracketEnd(bracketType = '(', string){
        
        let bracketTypeClosing;
        if(bracketType == '<'){bracketTypeClosing = '>'};
        if(bracketType == '('){bracketTypeClosing = ')'};
        if(bracketType == '{'){bracketTypeClosing = '}'};
        if(bracketType == '['){bracketTypeClosing = ']'};

        if(!string.includes(bracketType) || !string.includes(bracketType)){console.error('does not include bracket'); return string;};

        let startOfStr = string.indexOf(bracketType)
        let endOfStr = startOfStr;
        let bracketTracker = 0;
        while(1){
            if(string.charAt(endOfStr) == bracketType){bracketTracker++;}
            if(string.charAt(endOfStr) == bracketTypeClosing){bracketTracker--;}
            
            endOfStr++;
            if(bracketTracker == 0){break;}
        }

        return string.slice(startOfStr, endOfStr);
    }

    //takes in function element, applies it to the widget
    static structureBuilder(singleFunctionArrObj, widgetObj){

        switch(singleFunctionArrObj.type){
            case 'addCss':
                console.log('addCss');
                WidgetsOnGrid.cw_addCode(widgetObj, singleFunctionArrObj.arguments);
                break;

            case 'subGrid':
                console.log('subGrid');
                let argArr = singleFunctionArrObj.arguments.split(',')
                
                let gridSize = {};
                argArr.forEach(arg => {
                    if(parseInt(arg) != NaN){arg = parseInt(arg)}
                    if(gridSize.gridSegmentWidth === undefined){gridSize.gridSegmentWidth = arg; return;}
                    if(gridSize.gridSegmentHeight === undefined){gridSize.gridSegmentHeight = arg; return;}
                    if(gridSize.gridSegmentTopGap === undefined){gridSize.gridSegmentTopGap = arg; return;}
                    if(gridSize.gridSegmentLeftGap === undefined){gridSize.gridSegmentLeftGap = arg; return;}
                    if(gridSize.sizeUnit === undefined){gridSize.sizeUnit = arg; return;}
                })
                console.log(gridSize);
                WidgetsOnGrid.cw_addGridCode(widgetObj, gridSize);
                break;
        }
        
    }
}


//import {tools} from "./widgetFunctions.js";
//
//export class parseWidgetCode{
//    constructor(widgetRawJson, widgetID, gridInstance){
//
//        console.log(widgetID);
//        console.log('todo use widgetID to modify target widget')
//        let gridDivID = gridInstance.targetDivID;
//
//        
//
//        let dependentVars = widgetRawJson.dependentVars; //
//        let shortenedValues = widgetRawJson.shortenedValues; 
//        let widgetName = widgetRawJson.name; //
//
//        let name = widgetRawJson.name;
//        let sizeLimits = widgetRawJson.sizeLimits;
//        let divHTML = widgetRawJson.divHTML;
//        let jsSetup = widgetRawJson.jsSetup;
//        let jsFunction = widgetRawJson.jsFunction;
//        let jsUnsetup = widgetRawJson.jsUnsetup;
//        let widgetStructure = widgetRawJson.widgetStructure;
//
//
//
//
//        this.name = name;
//
//        this.sizeLimits = sizeLimits;
//
//        divHTML = parseWidgetCode.replaceShorts(divHTML, shortenedValues);
//        this.divHTML = divHTML;
//
//        jsSetup = parseWidgetCode.replaceFunctions(jsSetup, gridDivID, widgetID);
//        jsSetup = parseWidgetCode.replaceShorts(jsSetup, shortenedValues)
//        jsSetup = new Function('', jsSetup);
//        this.jsSetup = jsSetup;
//
//        jsFunction = parseWidgetCode.replaceFunctions(jsFunction, gridDivID, widgetID);
//        jsFunction = parseWidgetCode.replaceShorts(jsFunction, shortenedValues)
//        jsFunction = new Function('', jsFunction);
//        this.jsFunction = jsFunction;
//
//        jsUnsetup = parseWidgetCode.replaceFunctions(jsUnsetup, gridDivID, widgetID); 
//        jsUnsetup = parseWidgetCode.replaceShorts(jsUnsetup, shortenedValues)
//        jsUnsetup = new Function('', jsUnsetup);
//        this.jsUnsetup = jsUnsetup;
//
//        widgetStructure = parseWidgetCode.replaceShorts(widgetStructure, shortenedValues, widgetID);
//        widgetStructure = parseWidgetCode.replaceFunctions(widgetStructure, gridDivID, widgetID);
//        widgetStructure = new Function('', widgetStructure);
//        this.widgetStructure = widgetStructure;
//
//    }
//
//    get(){
//        let name = this.name;
//        let sizeLimits = this.sizeLimits
//        let divHTML = this.divHTML;
//        let jsSetup = this.jsSetup;
//        let jsFunction = this.jsFunction;
//        let jsUnsetup = this.jsUnsetup;
//        let widgetStructure = this.widgetStructure;
//
//
//        return{name, sizeLimits, divHTML, jsSetup, jsFunction, jsUnsetup, widgetStructure};
//    }
//
//    static replaceFunctions(rawString, gridDivID, widgetID){
//
//        while(rawString.includes('$/$replaceBackgroundImage$/$')){
//            let toBeReplaced = '$/$replaceBackgroundImage$/$'
//
//            let startOfVar = rawString.indexOf(toBeReplaced)+1;
//            startOfVar = startOfVar + toBeReplaced.length;
//
//            rawString = parseWidgetCode.getShortFunctionVars(rawString, startOfVar);
//            this.currentFunctionVars = parseWidgetCode.varsPrepareForBgImageReplace(this.currentFunctionVars);
//
//            rawString = rawString.replace(toBeReplaced, 'tools.modify.replaceBackgroundImage' + '(' + this.curFuncVarsToString() + ')');
//            this.currentFunctionVars = undefined;
//        }
//
//        while(rawString.includes('$/$addSize$/$')){
//            let toBeReplaced = '$/$addSize$/$'
//
//            let startOfVar = rawString.indexOf(toBeReplaced)+1;
//            startOfVar = startOfVar + toBeReplaced.length;
//
//            rawString = parseWidgetCode.getShortFunctionVars(rawString, startOfVar);
//            this.currentFunctionVars.push("'" + gridDivID + "'");
//
//            rawString = rawString.replace(toBeReplaced, 'tools.sizeOfElement' + '(' + this.curFuncVarsToString() + ')');
//            this.currentFunctionVars = undefined;
//        }
//
//        while(rawString.includes('$/$addCssCode$/$')){
//            let toBeReplaced = '$/$addCssCode$/$'
//
//            let startOfVar = rawString.indexOf(toBeReplaced)+1;
//            startOfVar = startOfVar + toBeReplaced.length;
//
//            rawString = parseWidgetCode.getShortFunctionVars(rawString, startOfVar);
//
//            rawString = rawString.replace(toBeReplaced, 'tools.addCssCode' + '(' + this.curFuncVarsToString() + ')');
//            this.currentFunctionVars = undefined;
//        }
//
//        while(rawString.includes('$/$subGrid$/$')){
//            let toBeReplaced = '$/$subGrid$/$'
//
//            let startOfVar = rawString.indexOf(toBeReplaced)+1;
//            startOfVar = startOfVar + toBeReplaced.length;
//
//            rawString = parseWidgetCode.getShortFunctionVars(rawString, startOfVar);
//            this.currentFunctionVars.unshift("'" + widgetID + "'");
//            this.currentFunctionVars.unshift("'" + gridDivID + "'");
//            
//
//            rawString = rawString.replace(toBeReplaced, 'tools.createSubGrid' + '(' + this.curFuncVarsToString() + ')');
//            this.currentFunctionVars = undefined;
//        }
//
//        if(rawString.includes('$/$')){console.warn('unknown function')}
//        return rawString;
//    }
//
//    static varsPrepareForBgImageReplace(vars){
//        vars[0] = '"background-image: url('+ vars[0] +')"';
//        vars[1] = '"background-image: url('+ vars[1] +')"';
//        return vars;
//    }
//
//    static currentFunctionVars = [];
//
//    static getShortFunctionVars(rawString, startOfVar){
//        let out = [];
//        let endOfVar = startOfVar-1;
//        let bracketTracker = 0;
//        while(1){
//            if(rawString.charAt(endOfVar) == '('){bracketTracker++;}
//            if(rawString.charAt(endOfVar) == ')'){bracketTracker--;}
//            
//            if(bracketTracker == 0){break;}
//            endOfVar++;
//        }
//
//        let varString = rawString.slice(startOfVar, endOfVar);
//        rawString = rawString.replace(rawString.slice(startOfVar-1, endOfVar+1), '');
//
//        while(1){
//            let end = varString.indexOf(',');
//            if(end == -1){ out.push(varString); break;}
//
//            out.push(varString.slice(0, end));
//
//            varString = varString.slice(end+1);
//
//            while(varString.charAt(0) == ' '){
//                varString = varString.substring(1);
//            }
//        }
//        this.currentFunctionVars = out;
//        return rawString;
//    }
//
//    static curFuncVarsToString(){
//        let curFuncVars = this.currentFunctionVars;
//        let varString = '';
//
//        if(curFuncVars[0] == ''){curFuncVars.shift()}
//        console.log(curFuncVars);
//
//        let i = 0;
//        while(1){
//            if(curFuncVars[i] === undefined){varString = varString.slice(0, varString.length-2); break;}
//
//            varString = varString + curFuncVars[i] + ', '
//            i++;
//        }
//        return varString;
//    }
//
//
//    static replaceShorts(rawString, shortenedValues){
//        let i = 0;
//        while(1){
//            if(shortenedValues[i] === undefined){break;}
//            let short = '$' + shortenedValues[i].short;
//            let full = shortenedValues[i].full;
//
//            rawString = rawString.replace(short, full);
//            if(rawString.includes(short)){i--;}
//
//            i++;
//        }
//        return rawString;
//    }
//
//
//}