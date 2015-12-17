/// <reference path="../Typings/chrome.d.ts" />
/// <reference path="../Typings/jquery/jquery.d.ts" />

chrome.runtime.onMessage.addListener(function(request,sender,sr){
	if(request.message == "read"){
		var input = $(":input");
		var msg = [];
		for(var i=0;i<input.length;i++){
			console.log(input[i].outerHTML);
			msg.push(input[i].outerHTML + "-form_bot-delimit-");
		}
		console.log(msg.toString());
	}
});