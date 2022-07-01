//adds code to 'managedCode' css style element

//TOTAL-CSS is total css code of all instances --> thats always on screen
//INDEX is comment at the end of each CSS code inside TOTAL-CSS (/*$number*/) that keeps track of how many time the line of code is used


//addLineOfcode to the element (non existent on screen) --> so also add to TOTAL-CSS --> if exists, just do +1 on INDEX
export function addLineOfcode(classes, code){

    let cssClassName = codeToCssClassName(code);
    let cssClassNameWithoutDot = cssClassName.slice(1);
    
    if(classes.classList.contains(cssClassNameWithoutDot)){
        console.warn('nothing to add, already there');
        return classes;
    }

    classes.classList.add(cssClassNameWithoutDot);

    if(document.getElementById('managedCode').innerText.includes(cssClassName)){
        setIndexValue(cssClassName, getIndexValue(cssClassName)+1);
        return classes;
    }


    document.getElementById('managedCode').innerHTML += cssClassName + '{' + code + ';}/*1*/';
    return classes;
}

//removeLineOfcode from the element (non existent on screen) --> so remove from TOTAL-CSS--> if INDEX > 1, just -1 on INDEX
export function removeLineOfcode(classes, code){

    let cssClassName = codeToCssClassName(code);
    let cssClassNameWithoutDot = cssClassName.slice(1);
    let fullClassText = getFullClassText(cssClassName);

    if(classes.classList.contains(cssClassNameWithoutDot) == 0){
        console.warn('nothing to remove, does not exist')
        return classes;
    }

    classes.classList.remove(cssClassNameWithoutDot);

    if(document.getElementById('managedCode').innerText.includes(cssClassName)){
        if(getIndexValue(cssClassName) > 0){
            setIndexValue(cssClassName, getIndexValue(cssClassName)-1)
        }else{
            if(getIndexValue(cssClassName) <= 0){
                let classTextToRemove = fullClassText +  '/*' + getIndexValue(cssClassName) + '*/';
                document.getElementById('managedCode').innerHTML = document.getElementById('managedCode').innerHTML.replace(classTextToRemove, '')
            }
        }

        return classes;
    }
    return classes;
}

//parseAddCode --> split the code and add send one by one to addLineOfcode

//parseRemoveCode --> split the code and add send one by one to remove LineOfcode


//codeToCssClassName --> takes in css code, and spits out a CSS name for it
function codeToCssClassName(cssCode){
    let cssClassName = cssCode;

    cssClassName = cssClassName.replaceAll(' ', '_');
    cssClassName = cssClassName.replaceAll('.', '_');
    cssClassName = cssClassName.replaceAll(',', '_');

    cssClassName = cssClassName.replaceAll(':', '_');
    cssClassName = cssClassName.replaceAll(';', '_');

    cssClassName = cssClassName.replaceAll('"', '_');
    cssClassName = cssClassName.replaceAll("'", '_');

    cssClassName = cssClassName.replaceAll('(', '_');
    cssClassName = cssClassName.replaceAll(')', '_');

    cssClassName = cssClassName.replaceAll('%', 'prc');

    return '.' + cssClassName;
}

function getIndexValue(cssClassName){

    let totalCssText = document.getElementById('managedCode').innerText;
    let start = totalCssText.indexOf(cssClassName);

    while(1){ // find the number of insatnces
        if(totalCssText.charAt(start) == '/' && totalCssText.charAt(start+1) == '*'){
            start = start + 2;
            break;
        }
        start++;
    }
    let end = start;
    while(1){ // find the number of insatnces
        if(totalCssText.charAt(end) == '*' && totalCssText.charAt(end+1) == '/'){
            break;
        }
        end++;
    }

    return parseInt(totalCssText.slice(start, end));
}

function setIndexValue(cssClassName, newValue){

    let totalCssText = document.getElementById('managedCode').innerText;
    let targetStart = totalCssText.indexOf(cssClassName);
    let targetCssClass = totalCssText.slice(targetStart)
    
    let start = 0;
    while(1){ // find the number of insatnces
        if(targetCssClass.charAt(start) == '/' && targetCssClass.charAt(start+1) == '*'){
            start = start + 2;
            break;
        }
        start++;
    }
    let end = start;
    while(1){ // find the number of insatnces
        if(targetCssClass.charAt(end) == '*' && targetCssClass.charAt(end+1) == '/'){
            break;
        }
        end++;
    }

    targetCssClass = targetCssClass.slice(0, end+2);
    
    let newTargetCssClass = targetCssClass.substring(0, start) + newValue + targetCssClass.substring(end);

    document.getElementById('managedCode').innerHTML = document.getElementById('managedCode').innerText.replace(targetCssClass, newTargetCssClass);
    return;
}

//getFullClassText --> form TOTAL-CSS
function getFullClassText(cssClassName){
    let classStart = document.getElementById('managedCode').innerHTML.indexOf(cssClassName);
    
    let classEnd = classStart;
    let bracketTracker = 0;
    while(1){
        classEnd++;
        if(document.getElementById('managedCode').innerText.charAt(classEnd) == '{'){
            bracketTracker++;
        }

        if(document.getElementById('managedCode').innerText.charAt(classEnd) == '}'){
            classEnd++;
            bracketTracker--;
            if(bracketTracker == 0){break;}
        }
    }

    let FullClassText = document.getElementById('managedCode').innerHTML.slice(classStart, classEnd);
    return FullClassText;
}