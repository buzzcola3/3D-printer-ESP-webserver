//each WIDGET_OBJECT has its own element and a name

//create a widget in ALL_WIDGETS[],
//then get the widgetID in NewWidget.getLastestID()
//then you can find a widget in ALL_WIDGETS[] using findWidget() to get the element


//ALL WIDGETS[] ---> Widget_1
//              \
//               \-> Widget_2

//--Widget1 --> addChild() --> gets unique reversable ID -->

//ALL WIDGETS[] ---> Widget_1 ---> Widget_1-child-1
//              \
//               \-> Widget_2

//--Widget1 --> addChild() --> gets unique reversable ID -->

//ALL WIDGETS[] ---> Widget_1 ---> Widget_1-child-1
//              \             \--> Widget_1-child-2
//               \-> Widget_2
import {addLineOfcode, removeLineOfcode, replaceLineOfCode} from "./ManageCode.js";

export class WidgetStructure{
    constructor(parentID, widgetName){
        //find empty part of the array
        let freeBranch = 0;
        
        while(1){
            if(WidgetStructure.widgetTree[freeBranch] === undefined){break}
            freeBranch++;
        }
        


        let newBranch = {
            children: [],
            ID: parentID + '_' + widgetName,
            divCode: document.createElement('div')
        }

        WidgetStructure.addressOfLastest = [] 
        WidgetStructure.addressOfLastest.push(freeBranch);
        WidgetStructure.widgetTree[freeBranch] = newBranch;
        
        //create a main Widget
    }

    static widgetTree = [];
    static addressOfLastest = [];

    static getLastest(){
        return this.addressOfLastest;
    }


    static addressToWidgetStructure(address = []){
        let structString = '';

        structString = 'widgetTree[' + address[0] + ']'

        let i = 1;
        while(1){
            if(address[i] === undefined){break;}
            
            structString += '.children['+ address[i] + ']'

            i++;
        }
        
        return structString;
    }

    static addCode(address, code){
        //addLineOfcode
        let structureRef = WidgetStructure.addressToWidgetStructure(address);
        console.log(structureRef)
        console.log('making child for: ' + address);

        let f = 'addLineOfcode(' + structureRef + '.divCode,"' + code + '"); return {widgetTree: widgetTree};'
        f = new Function('widgetTree', 'addLineOfcode', f);

        f(WidgetStructure.widgetTree, addLineOfcode);
        //let funOut = f(WidgetStructure.widgetTree, addLineOfcode);
        //WidgetStructure.widgetTree = funOut.widgetTree
    }
    
    createChild(parentAddress = [], childNode = document.createElement('div')){ //<-- [0,0]
        console.log(WidgetStructure.widgetTree);

        console.log('making child for: ' + parentAddress);


        let structureRef = WidgetStructure.addressToWidgetStructure(parentAddress);
        console.log(structureRef)
        console.log('making child for: ' + parentAddress);

        let f = 'let i = 0; while(1){ if(' + structureRef + '.children[i] === undefined){break;}; i++;}' + structureRef + '.children[i] = emptyElement; return {widgetTree: widgetTree, address: i};'
        f = new Function('widgetTree', 'emptyElement', f);

        //let f = structureRef + '.children.push(emptyElement);' + 'return widgetTree;' ;
        //f = new Function('widgetTree', 'emptyElement', f)

        let emptyElement = {
            children: [],
            divCode: childNode
        }

        let funOut = f(WidgetStructure.widgetTree, emptyElement);
        //WidgetStructure.widgetTree = funOut.widgetTree
        console.log(funOut.address)
        
        
        let childAddress = parentAddress.concat([])

        childAddress.push(funOut.address);
        
        return childAddress;
    }

    appendChild(){}

    hide(){}

    hideChildren(){}

    show(){}

    showChildren(){}
}