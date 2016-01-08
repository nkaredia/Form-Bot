/// <reference path="../Typings/chrome.d.ts" />
/// <reference path="../Typings/chrome/chrome-app.d.ts" />
/// <reference path="../Typings/chrome/chrome-cast.d.ts" />
/// <reference path="../Typings/bootbox/bootbox.d.ts" />

var openDisplay = false, d = -180, h = 0;
var hasData = false;
var port;

$(window).load(function () {
    chrome.storage.sync.get(function (val) {
        if (!val) {
            chrome.storage.sync.set({ color: "#D64541" }); //set default color
            changeColor("#D64541");
        }
        else {
            changeColor(val.color.toString());
        }
    });

});


$(document).ready(function () {
    port = chrome.runtime.connect({ name: "readPort" });
    port.postMessage("getData");

    // PORT EVENTS
    port.onMessage.addListener(function (msg) {
        var that = $(".read-container");
        if (msg == "false") {

            setError($(".read-container"), "No data found on this page", 3000);

        } else if (msg.toString().startsWith("saved")) {
            var s = msg.toString().slice(5, msg.toString().length);
            var option = '<option value="' + s + '" class="' + s + '">' + s + '</option>';
            console.log(option);
            $(".dt-select").append(option);

            $(".read-container").tooltip({ trigger: 'manual' }).tooltip('disable').tooltip('hide');
            $("#arrow").click();


        }
        else if (msg.toString().startsWith("drop-data")) {
            var s = msg.toString().slice(9, msg.toString().length);
            $(".dt-select").append(s);
            $("select").select2("val", null);
        }
        else if (msg.toString().startsWith("removed")) {
            var s = msg.toString().slice(7, msg.toString().length);
            bootbox.dialog({
                message: "Removed",
                buttons: {
                    main: {
                        label: "OK",
                        className: "btn-primary"
                    }
                }
            });
            $("."+s).remove();
            $("select").select2("val", null);
        }
        else if ("string" == typeof (msg)) {
            $(".data-display").html(msg);
            $("#arrow").click();
            $(that).addClass("orange");
            $(that).attr("data-original-title", "Give a name to your form data");
            that.tooltip({ trigger: 'manual' }).tooltip('enable').tooltip('show');
            $("#data-name").attr("placeholder", "Name of your data");
            $("#data-name").val("");
            hasData = true;
        }

        //    console.log(msg);
    });

    // PORT EVENTS
}); // Document.ready();


// SELECT 2 INIT

$(".dt-select").select2({
    placeholder: "Choose to insert...",
    templateResult: function (data) {
        if (data.id == null) {
            return data.text;
        }

        var $option = $("<span></span>");
        var $preview = $("<button class='remove-data glyphicon glyphicon-remove'></button>");
        $preview.prop("id", data.id);
        $preview.on('mouseup', function (evt) {
            // Select2 will remove the dropdown on `mouseup`, which will prevent any `click` events from being triggered
            // So we need to block the propagation of the `mouseup` event
            evt.stopPropagation();
        });

        $preview.on('click', function (evt) {
            removeData(data.text);
        });

        $option.text(data.text);
        $option.append($preview);

        return $option;
    }
});


$('.select2').removeAttr("style");
$(".select2").on("click", function () {
    $('.select2-results__options').perfectScrollbar();
    $('.select2-results__options').perfectScrollbar("update");
});
// SELECT 2 INIT



//   EVENTS

document.getElementById('read-button').addEventListener("click", function () {
    port.postMessage("read");
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


$(".color").on("click", function () {
    var color;
    if ($(this).hasClass("cg-blue")) {
        changeColor("#2C82C9");
        color = "#2C82C9";
    }
    else if ($(this).hasClass("cg-green")) {
        changeColor("#2ecc71");
        color = "#2ecc71";
    }
    else if ($(this).hasClass("cg-red")) {
        changeColor("#D64541");
        color = "#D64541";
    }
    chrome.storage.sync.set({ color: color });
});

$("#arrow").click(function () {

    d = openDisplay ? 0 : 180;
    h = openDisplay ? 0 : 140;
    $("#arrow").velocity({
        rotateZ: d + "deg"
    }, 500);
    $("#console").velocity({
        height: h + "px"
    }, 500);
    openDisplay = !openDisplay;
});

//  EVENTS 

function removeData(key) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
            port.postMessage("remove" + key.toString());
        }
    });
}
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