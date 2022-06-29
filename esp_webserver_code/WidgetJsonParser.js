import {tools} from "./widgetFunctions.js";

export class parseWidgetCode{
    constructor(widgetRawJson, gridInstance){

        console.log(gridInstance);
        let gridDivID = gridInstance.targetDivID;

        

        let dependentVars = widgetRawJson.dependentVars; //
        let shortenedValues = widgetRawJson.shortenedValues; 
        let widgetName = widgetRawJson.name; //

        let name = widgetRawJson.name;
        let sizeLimits = widgetRawJson.sizeLimits;
        let divHTML = widgetRawJson.divHTML;
        let jsSetup = widgetRawJson.jsSetup;
        let jsFunction = widgetRawJson.jsFunction;
        let jsUnsetup = widgetRawJson.jsUnsetup;
        let widgetStructure = widgetRawJson.widgetStructure;




        this.name = name;

        this.sizeLimits = sizeLimits;

        divHTML = parseWidgetCode.replaceShorts(divHTML, shortenedValues);
        this.divHTML = divHTML;

        jsSetup = parseWidgetCode.replaceFunctions(jsSetup, gridDivID);
        jsSetup = parseWidgetCode.replaceShorts(jsSetup, shortenedValues)
        jsSetup = new Function('', jsSetup);
        this.jsSetup = jsSetup;

        jsFunction = parseWidgetCode.replaceFunctions(jsFunction, gridDivID);
        jsFunction = parseWidgetCode.replaceShorts(jsFunction, shortenedValues)
        jsFunction = new Function('', jsFunction);
        this.jsFunction = jsFunction;

        jsUnsetup = parseWidgetCode.replaceFunctions(jsUnsetup, gridDivID); 
        jsUnsetup = parseWidgetCode.replaceShorts(jsUnsetup, shortenedValues)
        jsUnsetup = new Function('', jsUnsetup);
        this.jsUnsetup = jsUnsetup;

        widgetStructure = parseWidgetCode.replaceShorts(widgetStructure, shortenedValues);
        widgetStructure = parseWidgetCode.replaceFunctions(widgetStructure, gridDivID);
        widgetStructure = new Function('', widgetStructure);
        this.widgetStructure = widgetStructure;

    }

    get(){
        let name = this.name;
        let sizeLimits = this.sizeLimits
        let divHTML = this.divHTML;
        let jsSetup = this.jsSetup;
        let jsFunction = this.jsFunction;
        let jsUnsetup = this.jsUnsetup;
        let widgetStructure = this.widgetStructure;


        return{name, sizeLimits, divHTML, jsSetup, jsFunction, jsUnsetup, widgetStructure};
    }

    static replaceFunctions(rawString, gridDivID){

        while(rawString.includes('$/$replaceBackgroundImage$/$')){
            let toBeReplaced = '$/$replaceBackgroundImage$/$'

            let startOfVar = rawString.indexOf(toBeReplaced)+1;
            startOfVar = startOfVar + toBeReplaced.length;

            rawString = parseWidgetCode.getShortFunctionVars(rawString, startOfVar);
            this.currentFunctionVars = parseWidgetCode.varsPrepareForBgImageReplace(this.currentFunctionVars);

            rawString = rawString.replace(toBeReplaced, 'tools.modify.replaceBackgroundImage' + '(' + this.curFuncVarsToString() + ')');
            this.currentFunctionVars = undefined;
        }

        while(rawString.includes('$/$addSize$/$')){
            let toBeReplaced = '$/$addSize$/$'

            let startOfVar = rawString.indexOf(toBeReplaced)+1;
            startOfVar = startOfVar + toBeReplaced.length;

            rawString = parseWidgetCode.getShortFunctionVars(rawString, startOfVar);
            this.currentFunctionVars.push("'" + gridDivID + "'");

            rawString = rawString.replace(toBeReplaced, 'tools.sizeOfElement' + '(' + this.curFuncVarsToString() + ')');
            this.currentFunctionVars = undefined;
        }

        while(rawString.includes('$/$addCssCode$/$')){
            let toBeReplaced = '$/$addCssCode$/$'

            let startOfVar = rawString.indexOf(toBeReplaced)+1;
            startOfVar = startOfVar + toBeReplaced.length;

            rawString = parseWidgetCode.getShortFunctionVars(rawString, startOfVar);

            rawString = rawString.replace(toBeReplaced, 'tools.addCssCode' + '(' + this.curFuncVarsToString() + ')');
            this.currentFunctionVars = undefined;
        }

        while(rawString.includes('$/$subGrid$/$')){
            let toBeReplaced = '$/$subGrid$/$'

            let startOfVar = rawString.indexOf(toBeReplaced)+1;
            startOfVar = startOfVar + toBeReplaced.length;

            rawString = parseWidgetCode.getShortFunctionVars(rawString, startOfVar);
            this.currentFunctionVars.push("'" + gridDivID + "'");

            rawString = rawString.replace(toBeReplaced, 'tools.createSubGrid' + '(' + this.curFuncVarsToString() + ')');
            this.currentFunctionVars = undefined;
        }

        if(rawString.includes('$/$')){console.warn('unknown function')}
        return rawString;
    }

    static varsPrepareForBgImageReplace(vars){
        vars[0] = '"background-image: url('+ vars[0] +')"';
        vars[1] = '"background-image: url('+ vars[1] +')"';
        return vars;
    }

    static currentFunctionVars = [];

    static getShortFunctionVars(rawString, startOfVar){
        let out = [];
        let endOfVar = startOfVar-1;
        let bracketTracker = 0;
        while(1){
            if(rawString.charAt(endOfVar) == '('){bracketTracker++;}
            if(rawString.charAt(endOfVar) == ')'){bracketTracker--;}
            
            if(bracketTracker == 0){break;}
            endOfVar++;
        }

        let varString = rawString.slice(startOfVar, endOfVar);
        rawString = rawString.replace(rawString.slice(startOfVar-1, endOfVar+1), '');

        while(1){
            let end = varString.indexOf(',');
            if(end == -1){ out.push(varString); break;}

            out.push(varString.slice(0, end));

            varString = varString.slice(end+1);

            while(varString.charAt(0) == ' '){
                varString = varString.substring(1);
            }
        }
        this.currentFunctionVars = out;
        return rawString;
    }

    static curFuncVarsToString(){
        let curFuncVars = this.currentFunctionVars;
        let varString = '';

        let i = 0;
        while(1){
            if(curFuncVars[i] === undefined){varString = varString.slice(0, varString.length-2); break;}

            varString = varString + curFuncVars[i] + ', '
            i++;
        }
        return varString;
    }


    static replaceShorts(rawString, shortenedValues){
        let i = 0;
        while(1){
            if(shortenedValues[i] === undefined){break;}
            let short = '$' + shortenedValues[i].short;
            let full = shortenedValues[i].full;

            rawString = rawString.replace(short, full);
            if(rawString.includes(short)){i--;}

            i++;
        }
        return rawString;
    }


}