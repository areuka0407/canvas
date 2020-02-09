/**
 * String
 */

String.prototype.select = function(func = null){
    return func ? Array.from(document.querySelectorAll(this)).find(func) : document.querySelector(this);
}
String.prototype.selectAll = function(func = null){
    return func ? Array.from(document.querySelectorAll(this)).filter(func) : Array.from(document.querySelectorAll(this));
}
String.prototype.parseHTML = function(){
    let parent = document.createElement("div");
    parent.innerHTML = this;
    return parent.firstChild;
}

/**
 * Array
 */
Array.prototype.parseRGB = function(){
    let r = this.shift();
    let g = this.shift();
    let b = this.shift();
    return `rgb(${r},${g},${b})`;
};


/**
 * Document Object Model
 */


 function offset(target){
    let {offsetLeft, offsetTop, parentElement} = target;
    while(parentElement !== null){
        offsetLeft += parentElement.offsetLeft;
        offsetTop += parentElement.offsetTop;
        parentElement = parentElement.parentElement;
    }
    return {left: offsetLeft, top: offsetTop};
 }


