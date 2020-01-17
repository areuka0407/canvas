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