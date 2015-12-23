/// <reference path="../Typings/chrome.d.ts" />
/// <reference path="../Typings/jquery/jquery.d.ts" />
var inputTypes = ["text","number","checkbox","radio","date","color","range","month","week","time","datetime","datetime-local","email","search","tel","url"];
chrome.runtime.onConnect.addListener(function (port) {
    if (port.name == "readPort") {
        port.onMessage.addListener(function (_message) {
            if (_message == "read") {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { message: "read" }, function (response) {
                        console.log(response);
                        port.postMessage(response);
                    });
                });
            }
        });
    }
});

function extractReadableInputs(inputs){
    for(var i=0;i<inputs.length;i++){
        if($(inputs[i])[0].type){}
    }
}