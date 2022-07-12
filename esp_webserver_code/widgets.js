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
            addressID: freeBranch,
            hidden: false,
            hide: WidgetStructure.getHideFunction([freeBranch]),
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
        f = new Function('widgetTree', 'removeLineOfcode', f);

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

        let f = 'let i = 0; while(1){ if(' + structureRef + '.children[i] === undefined){break;}; i++;}' + structureRef + '.children[i] = emptyElement; let childAddress = parentAddress.concat([]);  childAddress.push(i); return {widgetTree: widgetTree, address: childAddress};'
        f = new Function('widgetTree', 'parentAddress', 'emptyElement', f);


        let emptyElement = {
            children: [],
            addressID: undefined,
            hidden: false,
            display: undefined,
            hide: undefined,
            divCode: childNode
        }

        let funOut = f(WidgetStructure.widgetTree, parentAddress, emptyElement);
        let childAddress = funOut.address

        WidgetStructure.getAddressObj(childAddress).hide = WidgetStructure.getHideFunction(childAddress);
        WidgetStructure.getAddressObj(childAddress).display = WidgetStructure.getDisplayFunction(childAddress);
        WidgetStructure.getAddressObj(childAddress).addressID = childAddress.toString();
        
        return childAddress;
    }

    static getAddressesOfChildren(parentAddress){
        let structureRef = WidgetStructure.addressToWidgetStructure(parentAddress);
        if(structureRef === undefined){return undefined};
        //console.warn(structureRef)
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

    static getChildren(parentAddress = []){ //returns an array of chilfren from least to most deep

        let searchAddress = parentAddress.concat([]);

        //if(this.ifExists)
        //if(this.hasChildren)
        //if(this.hasNextSibling)

        if(WidgetStructure.hasChildren(searchAddress) == false){return;}


        function getChildren(hasNextSibling, ifExists, orgSearchAddress = []){
            let searchAddress = orgSearchAddress.concat([]);
            searchAddress.push(0);
            let children = [];
            if(ifExists(searchAddress) == false){return children;}

            children.push(searchAddress.toString());

            while(hasNextSibling(searchAddress)){
                let nextSiblingNumber = (searchAddress.slice(-1)[0])+1;
                searchAddress.pop();
                searchAddress.push(nextSiblingNumber);
    
                children.push(searchAddress.toString());

                
            }

            
            let newChildren = [];
            children.forEach((child) => {
                newChildren.push(child.split(','))
            });
            children = newChildren;
            newChildren = [];

            children.forEach((child) => {
                let oneAddr = [];
                child.forEach((character) => {oneAddr.push(Number(character))})
                newChildren.push(oneAddr);
            })
            children = newChildren;
            newChildren = [];

            return children;
            //return children;
        }

        let children = getChildren(WidgetStructure.hasNextSibling, WidgetStructure.ifExists, searchAddress)


        let toSearchNext = [];
        toSearchNext = children.concat([]);


        while(1){
            let newToSearchNext = [];

            toSearchNext.forEach((child) => {
                newToSearchNext = newToSearchNext.concat(getChildren(WidgetStructure.hasNextSibling, WidgetStructure.ifExists, child));
            })
            newToSearchNext.forEach((child) => {children.push(child)})
            toSearchNext = newToSearchNext.concat([]);

            if(toSearchNext.toString() == [].toString()){break;}
        }
        console.log(children)
        return(children);
    }

    //status Functions
    static ifExists(address = []){
        if(address.length <= 1){return false}
        let parentAddr = address.concat([]);
        parentAddr.pop();

        let children = WidgetStructure.getAddressesOfChildren(parentAddr)
        if(children === undefined){return false}
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

        if(WidgetStructure.ifExists(parentAdd)){return true}
        
        return false;
    }


    

    static getHideFunction(address){ //returns a function that will hide element of the given address and it's children from DOM, 

        //let address = [' + address + '];
        //let children = getChildren(address);
        //children.reverse();

        //children.forEach((child) => {getAddressObj(child).hidden = true});
        //getAddressObj(address).hidden = true;

        window.getChildren = WidgetStructure.getChildren;
        window.getAddressObj = WidgetStructure.getAddressObj;

        let f = 'let address = [' + address + ']; let children = getChildren(address); children.reverse(); children.forEach((child) => {getAddressObj(child).hidden = true}); getAddressObj(address).hidden = true;'
        f = new Function(f)

        return f;
    }

    static getDisplayFunction(address){ //returns a function that will hide element of the given address and it's children from DOM, 

        //let address = [' + address + '];
        //let children = getChildren(address);
        //children.reverse();

        //children.forEach((child) => {getAddressObj(child).hidden = true});
        //getAddressObj(address).hidden = true;

        window.getChildren = WidgetStructure.getChildren;
        window.getAddressObj = WidgetStructure.getAddressObj;

        let f = 'let address = [' + address + ']; let children = getChildren(address); children.reverse(); children.forEach((child) => {getAddressObj(child).hidden = false}); getAddressObj(address).hidden = false;'
        f = new Function(f)

        return f;
    }

    static getAddressObj(address){
        let structureRef = WidgetStructure.addressToWidgetStructure(address);
        if(structureRef === undefined){return undefined};
        
        let f = 'return ' + structureRef;
        f = new Function('widgetTree', f);


        let value = f(WidgetStructure.widgetTree)

        return value;
    }

    getShowFunction(){}

    showChildren(){}
}