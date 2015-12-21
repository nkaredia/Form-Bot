/// <reference path="../Typings/chrome.d.ts" />
/// <reference path="../Typings/jquery/jquery.d.ts" />

chrome.runtime.onMessage.addListener(function(request,sender,sr){
	if(request.message == "read"){
		var input = $(":input");
		console.log(input);
		var msg = [];
		for(var i=0;i<input.length;i++){
			console.log(input[i]);
		}
		//console.log(msg.toString());
	}
});