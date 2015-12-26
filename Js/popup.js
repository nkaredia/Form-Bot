/// <reference path="../Typings/chrome.d.ts" />
/// <reference path="../Typings/chrome/chrome-app.d.ts" />
/// <reference path="../Typings/chrome/chrome-cast.d.ts" />



$(document).ready(function(){
   var port = chrome.runtime.connect({name: "readPort"});


document.getElementById('read-button').addEventListener("click",function(){
	port.postMessage("read");
});

port.onMessage.addListener(function(msg){
    if(msg != "false"){
        $(".data-display").html(msg);
    }else{
        var that = $(".read-container");
        that.tooltip('show');
        setTimeout(function() {
            that.tooltip('hide');
        }, 3000);
    }
	console.log(msg);
}); 




});