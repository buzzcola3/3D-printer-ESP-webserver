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
        if(address[0] === undefined){return undefined};

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

    static removeCode(address, code){
        let structureRef = WidgetStructure.addressToWidgetStructure(address);
        console.log('adding code to: ' + address);

        let f = 'removeLineOfcode(' + structureRef + '.divCode,"' + code + '"); return {widgetTree: widgetTree};'
        f = new Function('widgetTree', 'addLineOfcode', f);

        f(WidgetStructure.widgetTree, removeLineOfcode);
        //let funOut = f(WidgetStructure.widgetTree, addLineOfcode);
        //WidgetStructure.widgetTree = funOut.widgetTree
    }

    static addCode(address, code){
        let structureRef = WidgetStructure.addressToWidgetStructure(address);
        //console.log('adding code to: ' + address);

        let f = 'addLineOfcode(' + structureRef + '.divCode,"' + code + '"); return {widgetTree: widgetTree};'
        f = new Function('widgetTree', 'addLineOfcode', f);

        f(WidgetStructure.widgetTree, addLineOfcode);
        //let funOut = f(WidgetStructure.widgetTree, addLineOfcode);
        //WidgetStructure.widgetTree = funOut.widgetTree
    }
    
    createChild(parentAddress = [], childNode = document.createElement('div')){ //<-- [0,0]
        console.log('making child for: ' + parentAddress);


        let structureRef = WidgetStructure.addressToWidgetStructure(parentAddress);
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
        
        let childAddress = parentAddress.concat([])

        childAddress.push(funOut.address);
        
        return childAddress;
    }

    static getAddressesOfChildren(parentAddress){
        let structureRef = WidgetStructure.addressToWidgetStructure(parentAddress);
        if(structureRef === undefined){return undefined};
        console.warn(structureRef)
        //console.log('getting children of: ' + parentAddress);

        let f = 'let children = ' + structureRef + '.children; let childrenList = []; let i = 0; while(1){if(children[i] === undefined){break;} childrenList.push(i); i++;} return childrenList;'
        f = new Function('widgetTree', f);

        //console.log(f)
        let childrenArr = f(WidgetStructure.widgetTree);
        if(childrenArr[0] == undefined){return undefined}

        let i = 0;
        while(1){
            if(childrenArr[i] === undefined || childrenArr === undefined){break;}
            childrenArr[i] = parentAddress.concat(childrenArr[i]);
            i++;
        }

        return childrenArr;
    }

    static getChildrenArray(parentAddress = []){ //returns an array of children from the most nested to the least nested
        parentAddress = [0]
        //first check [0,0,0,0]
        // then check [0,0,0,1]
        // then check [0,0,0,2]
        // then check [0,0,1,0]
        // then check [0,0,1,1]
        // then check [0,3,0,0]
        console.log(this.widgetTree);
        let searchAddress = parentAddress.concat([]);

        let arrOut = [];
        

        let movingForward = true;

        while(1){

            while(movingForward){
                if(this.hasChildren(searchAddress)){searchAddress.push(0)}
                else{
                    if(this.hasNextSibling(searchAddress)){let nextSiblingNumber = (searchAddress.slice(-1)[0])+1; searchAddress.pop(); searchAddress.push(nextSiblingNumber)}
                    if(this.hasNextSibling(searchAddress) == false){movingForward = false; arrOut.push(searchAddress.concat([])); console.log(searchAddress)}
                }

            }

            while(movingForward == false){
                if(parentAddress.toString() == searchAddress.toString()){break;}

                if(this.hasNextSibling(searchAddress) == false){searchAddress.pop();}
                if(this.hasNextSibling(searchAddress)){let nextSiblingNumber = (searchAddress.slice(-1)[0])+1; searchAddress.pop(); searchAddress.push(nextSiblingNumber); movingForward = true;}
            }

            if(parentAddress.toString() == searchAddress.toString()){break;}


            //if(this.hasChildren(searchAddress) == false){searchAddress.pop(); break;}
            //searchAddress.push(0)
        }
        console.log(arrOut);

        return arrOut;
        
    }

    static ifExists(address){
        if(address.length <= 1){return false}
        let parentAddr = address.concat([]);
        parentAddr.pop();

        let children = this.getAddressesOfChildren(parentAddr)
        let length = children.length;
        let i = 0;
        while(1){
            if(i >= length){break;}

            if(children[i].toString() === address.toString()){return true}
            i++;
        }

        return false;

    }

    static hasChildren(address){
        if(address === undefined){return false}
        if(this.getAddressesOfChildren(address) === undefined){return false}
        return true;
    }

    static hasNextSibling(address){
        if(address === undefined){return false}
        if(address.length <= 1){return false}
        let parentAdd = address.concat([]);

        let currentSiblingNumber = parentAdd.slice(-1)[0]
    
        parentAdd.pop();
        parentAdd.push(currentSiblingNumber+1);

        if(this.ifExists(parentAdd)){return true}
        
        return false;
    }


//    static getHideFunction(address){ //returns a function that will hide element of the given address and it's children from DOM, 
//        let structureRef = WidgetStructure.addressToWidgetStructure(address);
//        console.log('creating hide function for: ' + address);
//
//        let f = 'addLineOfcode(' + structureRef + '.divCode,"' + code + '");'
//        f = new Function('widgetTree', 'addLineOfcode', f);
//
//        return;
//    }

    hideChildren(){}

    getShowFunction(){}

    showChildren(){}
}