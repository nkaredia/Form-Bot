/// <reference path="../Typings/chrome.d.ts" />
/// <reference path="../Typings/chrome/chrome-app.d.ts" />
/// <reference path="../Typings/chrome/chrome-cast.d.ts" />
/// <reference path="./bootstrap-dialog.min.js" />

var openDisplay = false, d = -180, h = 0;
var $selection = $(
    '<span class="select2-selection" role="combobox" ' +
    'aria-autocomplete="list" aria-haspopup="true" aria-expanded="false">' +
    '</span>'
    );

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
    var port = chrome.runtime.connect({ name: "readPort" });
    port.postMessage("getData");
    var hasData = false;
    document.getElementById('read-button').addEventListener("click", function () {

        port.postMessage("read");
    });

    port.onMessage.addListener(function (msg) {
        var that = $(".read-container");
        if (msg == "false") {

            setError($(".read-container"), "No data found on this page", 3000);

        } else if (msg.toString().startsWith("saved")) {
            var s = msg.toString().slice(5, msg.toString().length);
            var option = '<option value="' + s + '">' + s + '</option>';
            console.log(option);
            $(".dt-select").append(option);

            $(".read-container").tooltip({ trigger: 'manual' }).tooltip('disable').tooltip('hide');
            $("#arrow").click();


        } else if (msg.toString().startsWith("drop-data")) {
            var s = msg.toString().slice(9, msg.toString().length);
            $(".dt-select").append(s);
            $("select").select2("val", null);
        }
        else if (msg.toString().startsWith("removed")) {
            var s = msg.toString().slice(7, msg.toString().length);

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



    $(".remove-data").click(function (e) {
        e.preventDefault();
        BootstrapDialog.show({
            message: 'Hi Apple!',
            buttons: [{
                label: 'Button 1'
            }, {
                    label: 'Button 2',
                    cssClass: 'btn-primary',
                    action: function () {
                        alert('Hi Orange!');
                    }
                }, {
                    icon: 'glyphicon glyphicon-ban-circle',
                    label: 'Button 3',
                    cssClass: 'btn-warning'
                }, {
                    label: 'Close',
                    action: function (dialogItself) {
                        dialogItself.close();
                    }
                }]
        });
        //  var id = $(this).html();
        //  port.postMessage("remove" + id.toString());
    });

});

function formatState(state) {
    /*  console.log(state);
      if (!state.id) { return state.text }
        return `<span>` + state.text + `
               <button class="remove-data glyphicon glyphicon-remove"></button>
          </span>`;*/

    if (!state.id) return state.text; // optgroup
        return state.text + '<button class="remove-data glyphicon glyphicon-remove"></button>';
}
var select2 = $('select').select2({
    placeholder: "Choose to insert...",
    templateResult: formatState,
    templateSelection: formatState,
    formatSelection: formatState,
    formatResult: formatState,
    closeOnSelect: false,
    escapeMarkup: function (m) { return m; }
}).data('select2');
select2.onSelect = (function (fn) {
    return function (data, options) {
        var target;

        if (options != null) {
            target = $(options.target);
        }

        if (target && target.hasClass('remove-data')) {
            alert('click!');
        } else {
            return fn.apply(this, arguments);
        }
    }
})(select2.onSelect);


$('.select2').removeAttr("style");
$(".select2").on("click", function () {

    console.log("fired");
    /*setTimeout(function() {
        $(".ps-container").css("hidden !important");
    }, 3000);*/
    //$(".ps-container").css("hidden !important");
    $('.select2-results__options').perfectScrollbar();
    $('.select2-results__options').perfectScrollbar("update");
});



$(".remove-data").hover(function () {
    $(".remove-data").tooltip({ trigger: 'manual' }).tooltip('enable').tooltip('show');
}, function () {
    $(".remove-data").tooltip({ trigger: 'manual' }).tooltip('disable').tooltip('hide');
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



function removeData(key) {
    e.preventDefault();
    BootstrapDialog.show({
        message: 'Hi Apple!',
        buttons: [{
            label: 'Button 1'
        }, {
                label: 'Button 2',
                cssClass: 'btn-primary',
                action: function () {
                    alert('Hi Orange!');
                }
            }, {
                icon: 'glyphicon glyphicon-ban-circle',
                label: 'Button 3',
                cssClass: 'btn-warning'
            }, {
                label: 'Close',
                action: function (dialogItself) {
                    dialogItself.close();
                }
            }]
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