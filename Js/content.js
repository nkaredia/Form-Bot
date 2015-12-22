/// <reference path="../Typings/chrome.d.ts" />
/// <reference path="../Typings/jquery/jquery.d.ts" />

chrome.runtime.onMessage.addListener(function (request, sender, sr) {
    if (request.message == "read") {
        var input = $(":input");
        console.log(input);
        var msg = [];
        for (var i = 0; i < input.length; i++) {
            if (isToggleInput(input[i])) {
                if ($(input[i])[0].checked) {
                    $(input[i]).attr("checked", "checked");
                }
                else {
                    $(input[i]).removeAttr("checked");
                    $(input[i])[0].checked = false;
                }
            }
            else {
                $(input[i]).attr("value", $(input[i]).val());
                console.log(input[i]);
            }
            msg.push($(input[i])[0].outerHTML);
        }
        console.log(msg);
        //console.log(msg.toString());
        sr({message: msg});
    }
});
function isToggleInput(i) {
    console.log(i.type == "checkbox" || i.type == "radio" ? true : false);
    return i.type == "checkbox" || i.type == "radio" ? true : false;
}