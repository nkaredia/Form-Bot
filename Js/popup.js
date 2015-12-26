/// <reference path="../Typings/chrome.d.ts" />
/// <reference path="../Typings/chrome/chrome-app.d.ts" />
/// <reference path="../Typings/chrome/chrome-cast.d.ts" />



$(document).ready(function(){
   var port = chrome.runtime.connect({name: "readPort"});
   var that = $(".read-container");

document.getElementById('read-button').addEventListener("click",function(){
	port.postMessage("read");
});

port.onMessage.addListener(function(msg){
    if(msg != "false"){
        $(".data-display").html(msg);
        $(that).addClass("orange");
        $(that).attr("data-original-title", "Give a name to your form data");
        that.tooltip({trigger: 'manual'}).tooltip('enable').tooltip('show');
    }else{

        $(that).addClass("red");
        $(that).attr("data-original-title", "No data found on this page");

        that.tooltip({trigger: 'manual'}).tooltip('enable').tooltip('show');
        setTimeout(function() {
            that.tooltip({trigger: 'manual'}).tooltip('disable').tooltip('hide');
            $(that).removeClass("red");
            $(that).attr("data-original-title", "");
        }, 3000)
    }
	console.log(msg);
}); 

/*
$(".read-container").mouseleave(function(){
    if(tooltipShow){
        var that = $(".read-container");
        that.tooltip('show');
    }
});
*/

});