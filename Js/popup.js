/// <reference path="../Typings/chrome.d.ts" />
/// <reference path="../Typings/chrome/chrome-app.d.ts" />
/// <reference path="../Typings/chrome/chrome-cast.d.ts" />



$(document).ready(function () {
    var port = chrome.runtime.connect({ name: "readPort" });

    var hasData = false;




    document.getElementById('read-button').addEventListener("click", function () {
        port.postMessage("read");
    });

    port.onMessage.addListener(function (msg) {
        var that = $(".read-container");
        if (msg == "false") {

            setError($(".read-container"), "No data found on this page", 3000);

        } else if ("string" == typeof (msg)) {
            $(".data-display").html(msg);
            $(that).addClass("orange");
            $(that).attr("data-original-title", "Give a name to your form data");
            that.tooltip({ trigger: 'manual' }).tooltip('enable').tooltip('show');
            $("#data-name").attr("placeholder", "Name of your data");
            $("#data-name").val("");
            hasData = true;
        }
        else if(msg.toString().endsWith("saved")){
            
        }
        console.log(msg);
    });

    $(".save,.discard").on('click', function (event) {
        var that = $(this);
        if (!hasData) {
            setError(that, "No data to " + $(this).html(), 3000);
        }
        else if (hasData) {
            if (that.hasClass("save")) {
                if ($("#data-name").val() === "") {
                    if ($(".read-container").attr("data-original-title") === "") {
                        setError($(".read-container"), "Please name your data before saving", 3000);
                    }
                    else {
                        $(".read-container").removeClass("orange");
                        setError($(".read-container"), "Please name your data before saving", 3000);
                    }
                }else{
                    var m = "save";
                    m+= $("#data-name").val();
                    port.postMessage(m);
                }
            }
            else if (that.hasClass("discard")) {
                if ($("#data-name").val() === "") {
                    
                }
            }
        }
    });

});

function setError(element, errMessage, errDuration) {
    $(element).addClass("red");
    $(element).attr("data-original-title", errMessage);


    element.tooltip({ trigger: 'manual' }).tooltip('enable').tooltip('show');
    setTimeout(function () {
        element.tooltip({ trigger: 'manual' }).tooltip('disable').tooltip('hide');
        $(element).removeClass("red");
        $(element).attr("data-original-title", "");
        $(element).blur();
    }, errDuration);
}