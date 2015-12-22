/// <reference path="../Typings/chrome.d.ts" />
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