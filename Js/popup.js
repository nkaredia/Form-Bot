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
        else if (msg.toString().endsWith("saved")) {

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
                } else {
                    var m = "save";
                    m += $("#data-name").val();
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

$('select').select2();
$('.select2').removeAttr("style");

$(".select2").on("click", function () {

    $('.select2-results__options').perfectScrollbar();
    $('.select2-results__options').perfectScrollbar();
    $('.select2-results__options').perfectScrollbar("update");
});

$(".color").on("click", function () {
    if ($(this).hasClass("cg-blue")) {
        changeColor("#2C82C9");
    }
    else if($(this).hasClass("cg-green")){
        changeColor("#2ecc71");
    }
    else if($(this).hasClass("cg-red")){
        changeColor("#D64541");
    }
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

function changeColor(color) {
    var cssStr = `header
         {
            background-color: `+ color + `;
         }

       .bottom-section {
            border-top: 1px solid `+ color + `;
        }

        .bottom-section > div:first-child {
            border: 1px solid `+ color + `;
        }

        .bottom-section > div:first-child > button {
            background-color: `+ color + `;
        }

        .bottom-section > .middle > button {
            background-color: `+ color + `;
        }

        .bottom-section > div:last-child {
            border: 1px solid `+ color + `;
        }

        .bottom-section > div:last-child > div:first-child {
            background-color: `+ color + `;
        }

        .bottom-section > div:last-child > div:first-child > button {
            background-color: `+ color + `;
        }

        .select2-container--default .select2-selection--single{
            border: 1px solid `+ color + `;
            background-color: `+ color + `;
        }

        .select2-container--default .select2-search--dropdown .select2-search__field{
            border: 1px solid `+ color + `;
        }

        .select2-dropdown{
            border: 1px solid `+ color + `;
        }

        .select2-container--default .select2-results__option--highlighted[aria-selected]{
            background-color: `+ color + `;
}

        `;

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = head.getElementsByTagName("style")[0];


    style.type = 'text/css';
    if (style.styleSheet) {
        $(style).html("");
        style.styleSheet.cssText = cssStr;
    } else {
        $(style).html("");
        style.appendChild(document.createTextNode(cssStr));
    }

    // head.appendChild(style);

}