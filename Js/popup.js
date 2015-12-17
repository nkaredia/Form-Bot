/// <reference path="../Typings/chrome.d.ts" />
/// <reference path="../Typings/chrome/chrome-app.d.ts" />
/// <reference path="../Typings/chrome/chrome-cast.d.ts" />

var port = chrome.runtime.connect({name: "readPort"});


document.getElementById('read-button').addEventListener("click",function(){
	port.postMessage("read");
});

port.onMessage.addListener(function(msg){
	console.log(msg);
});