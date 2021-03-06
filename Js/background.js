/// <reference path="../Typings/chrome/chrome.d.ts" />
/// <reference path="../Typings/jquery/jquery.d.ts" />
//var inputTypes = ["text","number","checkbox","radio","date","color","range","month","week","time","datetime","datetime-local","email","search","tel","url"];
var response_data = [];
chrome.runtime.onConnect.addListener(function (port) {
    if (port.name == "readPort") {
        port.onMessage.addListener(function (_message) {
            if (_message == "read") {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { message: "read" }, function (response) {
                        console.log(response);
                        if (response.message != "false") {
                            response_data = response.message;
                            var sendDom = makeDOM(response.message);
                            port.postMessage(sendDom);
                        }
                        else {
                            port.postMessage("false");
                        }
                    });
                });
            }
            else if (_message.toString().startsWith("save")) {
                console.log(_message);
                var _key = _message.toString().slice(4, _message.toString().length);
                var obj = {};
                obj[_key] = response_data;
                chrome.storage.local.set(obj);
                chrome.storage.local.get(function (d) {
                    console.log(d);
                });                       
                //  chrome.storage.local.remove(_key);
                port.postMessage("saved" + _key);
            }
            else if (_message.toString().startsWith("remove")) {
                var _key = _message.toString().slice(6, _message.toString().length);
                chrome.storage.local.remove(_key);
                port.postMessage("removed" + _key);
            }
            else if(_message.toString().startsWith("preview")){
                var _key = _message.toString().slice(7,_message.toString().length);
                chrome.storage.local.get(function(d){
                    port.postMessage("preview"+makeDOM(d[_key]));
                });
            }
            else if (_message.toString() == "getData") {
                chrome.storage.local.get(function (data) {
                    /* for (var key in data) {
                         option = '<option value="' + key + '">' + key + '</option>';
                         dom += option;
                     }*/
                    port.postMessage("drop-data" + getData(data));
                });
            }
        });
        port.onDisconnect.addListener(function () {
            response_data = [];
        });
    }
});

function getData(data) {
    var dom = "";
    for (var key in data) {
        var option = '<option value="' + key + '" class="'+key+'">' + key + '</option>';
        dom += option;
    }
    return dom;
}

function makeDOM(inputs){
    var dom = "<table class='preview_window_table'>";
    for(var i = 0; i < inputs.length; i++){
        dom += makeRow($(inputs[i]));
    }
    return dom + "</table>"
}

function makeRow(input){
    var value = "";
    if (input[0].type == "checkbox" || input[0].type == "radio") {
        value = input[0].checked;
    }
    else if (input[0].type == "select-multiple" || input[0].type == "select-one" || input[0].type == "textarea") {
        value = $(input).attr("value");
    }
    else {
        value = input[0].value;
    }
    return "<tr>" + makeCol(input[0].type, value) + "</tr>";
}

function makeCol(key,value){
    return "<td>" + key + "</td><td>" + value + "</td>";
}

// function makeDOM(inputs) {
//     var dom = "";
//     for (var i = 0; i < inputs.length; i++) {
//         dom += makeRow($(inputs[i]));
//     }
//     return dom;
// }
// 
// function makeRow(input) {
//     var value = "";
//     if (input[0].type == "checkbox" || input[0].type == "radio") {
//         value = input[0].checked;
//     }
//     else if (input[0].type == "select-multiple" || input[0].type == "select-one" || input[0].type == "textarea") {
//         value = $(input).attr("value");
//     }
//     else {
//         value = input[0].value;
//     }
//     return "<div>" + makeCol(input[0].type, value) + "</div>";
// }
// 
// function makeCol(key, value) {
//     return "<div>" + key + "</div><div>" + value + "</div>";
// }