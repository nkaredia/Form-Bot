/// <reference path="../Typings/chrome.d.ts" />
/// <reference path="../Typings/chrome/chrome-app.d.ts" />
/// <reference path="../Typings/chrome/chrome-cast.d.ts" />



$(document).ready(function(){
   var port = chrome.runtime.connect({name: "readPort"});
   
   var hasData = false;

document.getElementById('read-button').addEventListener("click",function(){
	port.postMessage("read");
});

port.onMessage.addListener(function(msg){
    var that = $(".read-container");
    if(msg != "false"){       
        $(".data-display").html(msg);
        $(that).addClass("orange");
        $(that).attr("data-original-title", "Give a name to your form data");
        that.tooltip({trigger: 'manual'}).tooltip('enable').tooltip('show');
        hasData = true;
    }else{

        $(that).addClass("red");
        $(that).attr("data-original-title", "No data found on this page");

        that.tooltip({trigger: 'manual'}).tooltip('enable').tooltip('show');
        setTimeout(function() {
            that.tooltip({trigger: 'manual'}).tooltip('disable').tooltip('hide');
            $(that).removeClass("red");
            $(that).attr("data-original-title", "");
        }, 3000);
    }
	console.log(msg);
}); 

$(".save,.discard").on('click',function(event){
    var that = $(this);    
    if(!hasData){
        $(that).addClass("red");
        $(that).attr("data-original-title", "No data to "+$(this).html());

        that.tooltip({trigger: 'manual'}).tooltip('enable').tooltip('show');
        setTimeout(function() {
            that.tooltip({trigger: 'manual'}).tooltip('disable').tooltip('hide');
            $(that).removeClass("red");
            $(that).attr("data-original-title", "");
            $(this).blur();
        }, 3000);
    }

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