// /// <reference path="../Typings/chrome.d.ts" />
// /// <reference path="../Typings/chrome/chrome-app.d.ts" />
// /// <reference path="../Typings/chrome/chrome-cast.d.ts" />
// /// <reference path="../Typings/bootbox/bootbox.d.ts" />
// 
// var openDisplay = false, d = -180, h = 0;
// var hasData = false;
// var port;
// 
// $(window).load(function () {
//     chrome.storage.sync.get(function (val) {
//         if (!val) {
//             chrome.storage.sync.set({ color: "#D64541" }); //set default color
//             changeColor("#D64541");
//         }
//         else {
//             changeColor(val.color.color.toString(),val.color.hover.toString());
//         }
//     });
// 
// });
// 
// 
// $(document).ready(function () {
//     port = chrome.runtime.connect({ name: "readPort" });
//     port.postMessage("getData");
// 
//     // PORT EVENTS
//     port.onMessage.addListener(function (msg) {
//         var that = $(".read-container");
//         if (msg == "false") {
// 
//             setError($(".read-container"), "No data found on this page", 3000);
// 
//         } else if (msg.toString().startsWith("saved")) {
//             var s = msg.toString().slice(5, msg.toString().length);
//             var option = '<option value="' + s + '" class="' + s + '">' + s + '</option>';
//             console.log(option);
//             $(".dt-select").append(option);
// 
//             $(".read-container").tooltip({ trigger: 'manual' }).tooltip('disable').tooltip('hide');
//             $("#arrow").click();
//             $("#console").html("");
//             $(".data-name").val("");
//           
// 
// 
//         }
//         else if (msg.toString().startsWith("drop-data")) {
//             var s = msg.toString().slice(9, msg.toString().length);
//             $(".dt-select").append(s);
//             $("select").select2("val", null);
//         }
//         else if (msg.toString().startsWith("removed")) {
//             var s = msg.toString().slice(7, msg.toString().length);
//             bootbox.dialog({
//                 message: "Removed",
//                 buttons: {
//                     main: {
//                         label: "OK",
//                         className: "bootbox-ok-button"
//                     }
//                 }
//             });
//             $("."+s).remove();
//             $("select").select2("val", null);
//         }
//         else if ("string" == typeof (msg)) {
//             $(".data-display").html(msg);
//             $("#arrow").click();
//          
//             $(that).addClass("orange");
//             $(that).attr("data-original-title", "Give a name to your form data");
//             that.tooltip({ trigger: 'manual' }).tooltip('enable').tooltip('show');
//             $("#data-name").attr("placeholder", "Name of your data");
//             $("#data-name").val("");
//             hasData = true;
//         }
// 
//         //    console.log(msg);
//     });
// 
//     // PORT EVENTS
//     
//     
//     $('#console').perfectScrollbar();
// }); // Document.ready();
// 
// 
// // SELECT 2 INIT
// 
// $(".dt-select").select2({
//     placeholder: "Choose to insert...",
//     templateResult: function (data) {
//         if (data.id == null) {
//             return data.text;
//         }
// 
//         var $option = $("<span></span>");
//         var $preview = $("<span class='option-control-container'><button class='preview-data glyphicon glyphicon-eye-open'></button><button class='remove-data glyphicon glyphicon-remove'></button></span>");
//         $preview.prop("id", data.id);
//         $preview.on('mouseup', function (evt) {
//             // Select2 will remove the dropdown on `mouseup`, which will prevent any `click` events from being triggered
//             // So we need to block the propagation of the `mouseup` event
//             evt.stopPropagation();
//         });
// 
//         $preview.find('.remove-data').on('click', function (evt) {
//             removeData(data.text);
//         });
// 
//         $option.text(data.text);
//         $option.append($preview);
// 
//         return $option;
//     }
// });
// 
// 
// $('.select2').removeAttr("style");
// $(".select2").on("click", function () {
//     $('.select2-results__options').perfectScrollbar();
//     $('.select2-results__options').perfectScrollbar("update");
// });
// // SELECT 2 INIT
// 
// 
// 
// //   EVENTS
// 
// document.getElementById('read-button').addEventListener("click", function () {
//     port.postMessage("read");
// });
// 
// $(".save,.discard").on('click', function (event) {
//     var that = $(this);
//     if (!hasData) {
//         setError(that, "No data to " + $(this).html(), 3000);
//     }
//     else if (hasData) {
//         if (that.hasClass("save")) {
//             if ($("#data-name").val() === "") {
//                 if ($(".read-container").attr("data-original-title") === "") {
//                     setError($(".read-container"), "Please name your data before saving", 3000);
//                 }
//                 else {
//                     $(".read-container").removeClass("orange");
//                     setError($(".read-container"), "Please name your data before saving", 3000);
//                 }
//             } else {
//                 var m = "save";
//                 m += $("#data-name").val();
//                 port.postMessage(m);
//             }
//         }
//         else if (that.hasClass("discard")) {
//             if ($("#data-name").val() === "") {
// 
//             }
//         }
//     }
// });
// 
// 
// $(".color").on("click", function () {
//     var color
//     var hover;
//     if ($(this).hasClass("cg-blue")) {
//         changeColor("#2C82C9", "#2368a0");
//         color = "#2C82C9";
//         hover = "#2368a0";
//     }
//     else if ($(this).hasClass("cg-green")) {
//         changeColor("#2ecc71", "#24a35a");
//         color = "#2ecc71";
//         hover = "#24a35a";
//     }
//     else if ($(this).hasClass("cg-red")) {
//         changeColor("#D64541","#ab3734");
//         color = "#D64541";
//         hover = "#ab3734";
//     }
//     chrome.storage.sync.set({ color: {color:color,hover:hover} });
// });
// 
// $("#arrow").click(function () {
// 
//     d = openDisplay ? 0 : 180;
//     h = openDisplay ? 0 : 140;
//     $("#arrow").velocity({
//         rotateZ: d + "deg"
//     }, 500);
//     $("#console").velocity({
//         height: h + "px"
//     }, 500);
//     openDisplay = !openDisplay;
// });
// 
// //  EVENTS 
// 
// function removeData(key) {
//  /*   bootbox.confirm("Are you sure?", function (result) {
//         if (result) {
//             port.postMessage("remove" + key.toString());
//         }
//     });*/
//     bootbox.confirm({
//         message: "Are you sure?",
//         buttons : {
//             'cancel': {
//                 label: 'Cancel',
//                 className: 'bootbox-cancel-button'
//             },
//             'confirm' : {
//                 label: 'Ok',
//                 className: 'bootbox-ok-button'
//             }
//         },
//         callback: function(result){
//             if(result){
//                 port.postMessage("remove" + key.toString());
//             }
//         }
//     });
// }
// function setError(element, errMessage, errDuration) {
//     $(element).addClass("red");
//     $(element).attr("data-original-title", errMessage);
// 
// 
//     element.tooltip({ trigger: 'manual' }).tooltip('enable').tooltip('show');
//     setTimeout(function () {
//         element.tooltip({ trigger: 'manual' }).tooltip('disable').tooltip('hide');
//         $(element).removeClass("red");
//         $(element).attr("data-original-title", "");
//         $(element).blur();
//     }, errDuration);
// }
// 
// function changeColor(color,hover) {
//     var cssStr = `header
//          {
//             background-color: `+ color + `;
//          }
// 
//        .bottom-section {
//             border-top: 1px solid `+ color + `;
//         }
// 
//         .bottom-section > div:first-child {
//             border: 1px solid `+ color + `;
//         }
// 
//         .bottom-section > div:first-child > button {
//             background-color: `+ color + `;
//         }
//         
//         .bottom-section > div:first-child > button:hover {
//                 background-color: `+hover+`;
//         }
// 
//         .bottom-section > .middle > button {
//             background-color: `+ color + `;
//         }
// 
//         .bottom-section > div:last-child {
//             border: 1px solid `+ color + `;
//         }
// 
//         .bottom-section > div:last-child > div:first-child {
//             background-color: `+ color + `;
//         }
// 
//         .bottom-section > div:last-child > div:first-child > button {
//             background-color: `+ color + `;
//         }
// 
//         .select2-container--default .select2-selection--single{
//             border: 1px solid `+ color + `;
//             background-color: `+ color + `;
//         }
// 
//         .select2-container--default .select2-search--dropdown .select2-search__field{
//             border: 1px solid `+ color + `;
//         }
// 
//         .select2-dropdown{
//             border: 1px solid `+ color + `;
//         }
// 
//         .select2-container--default .select2-results__option--highlighted[aria-selected]{
//             background-color: `+ color + `;
//         }
//         
//         .btn-primary{
//             background-color: `+color+`;
//             border-color: `+hover+`;
//         }
//         
//         .btn-primary:hover{
//             background-color: `+hover+`
//         }
//         
//         .bootbox-ok-button{
//             background-color: `+color+`
//         }
//         
//         .bootbox-ok-button:hover{
//             background-color: `+hover+`
//         }
// 
//         .modal-body{
//             background-color: `+color+`
//         }
// 
//         `;
// 
//     var head = document.head || document.getElementsByTagName('head')[0];
//     var style = head.getElementsByTagName("style")[0];
// 
// 
//     style.type = 'text/css';
//     if (style.styleSheet) {
//         $(style).html("");
//         style.styleSheet.cssText = cssStr;
//     } else {
//         $(style).html("");
//         style.appendChild(document.createTextNode(cssStr));
//     }
// 
//     // head.appendChild(style);
// 
// }


var FormBotApp;
(function (FormBotApp) {
    var FormBot = (function () {
        function FormBot() {
            this.InitializeApp = function (self) {
                chrome.storage.sync.get(function (val) {
                    if (!val) {
                    }
                    else {
                        // this.changeColor(val.color.color.toString(), val.color.hover.toString());
                        self.changeColor(val.color.color.toString(), val.color.hover.toString());
                    }
                });
                self.bindChromeEvents(self);
                self.InitializeSelect2(self);
                $('.select2').removeAttr("style");
                self.bindDOMEvents(self);
                self.port.postMessage("getData");
                $('.select2-results__options').perfectScrollbar();
                $('.select2-results__options').perfectScrollbar("update");
            };
            this.InitializeSelect2 = function (self) {
                $(".dt-select").select2({
                    placeholder: "Choose to insert...",
                    templateResult: function (data) {
                        if (data.id == null) {
                            return data.text;
                        }
                        var $option = $("<span></span>");
                        var $preview = $("<span class='option-control-container'><button class='preview-data glyphicon glyphicon-eye-open'></button><button class='remove-data glyphicon glyphicon-remove'></button></span>");
                        $preview.prop("id", data.id);
                        $preview.on('mouseup', function (evt) {
                            // Select2 will remove the dropdown on `mouseup`, which will prevent any `click` events from being triggered
                            // So we need to block the propagation of the `mouseup` event
                            evt.stopPropagation();
                        });
                        $preview.find('.remove-data').on('click', function (evt) {
                            self.removeData(data.text, self);
                        });
                        $option.text(data.text);
                        $option.append($preview);
                        return $option;
                    }
                });
            };
            this.bindChromeEvents = function (self) {
                self.port.onMessage.addListener(function (msg) {
                    self.chromeMessageListener(msg, self);
                });
            };
            this.bindDOMEvents = function (self) {
                document.getElementById("arrow").addEventListener("click", function (e) {
                    self.arrowClick(e, self);
                });
                Array.prototype.slice.call(document.getElementsByClassName("color"))
                    .forEach(function (el) {
                    el.addEventListener("click", function (e) {
                        self.changeTheme(e, self);
                    });
                });
                Array.prototype.slice.call(document.getElementsByClassName("save"))
                    .forEach(function (el) {
                    el.addEventListener("click", function (e) {
                        self.saveData(e, self);
                    });
                });
                Array.prototype.slice.call(document.getElementsByClassName("discard"))
                    .forEach(function (el) {
                    el.addEventListener("click", function (e) {
                        self.discardData(e, self);
                    });
                });
                document.getElementById("read-button").addEventListener("click", function (e) {
                    self.readData(e, self);
                });
                Array.prototype.slice.call(document.getElementsByClassName("select2"))
                    .forEach(function (el) {
                    el.addEventListener("click", function (e) {
                        self.select2ClickEvent(e, self);
                    });
                });
            };
            this.chromeMessageListener = function (msg, self) {
                var that = $(".read-container");
                if (msg == "false") {
                    self.setError(".read-container", "No data found on this page", 3000);
                }
                else if (msg.toString().startsWith("saved")) {
                    var s = msg.toString().slice(5, msg.toString().length);
                    var option = '<option value="' + s + '" class="' + s + '">' + s + '</option>';
                    console.log(option);
                    $(".dt-select").append(option);
                    $(".read-container").tooltip({ trigger: 'manual' }).tooltip('disable').tooltip('hide');
                    $("#arrow").click();
                    $("#console").html("");
                    $(".data-name").val("");
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
                                className: "bootbox-ok-button"
                            }
                        }
                    });
                    $("." + s).remove();
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
                    self.hasData = true;
                }
            };
            this.select2ClickEvent = function (e, self) {
                $('.select2-results__options').perfectScrollbar();
                $('.select2-results__options').perfectScrollbar("update");
            };
            this.readData = function (e, self) {
                self.port.postMessage("read");
            };
            this.saveData = function (e, self) {
                var that = $(e.srcElement);
                if (!self.hasData) {
                    self.setError(e.srcElement.className, "No data to " + $(that).html(), 3000);
                }
                else if (self.hasData) {
                    if ($("#data-name").val() === "") {
                        if ($(".read-container").attr("data-original-title") === "") {
                            self.setError(".read-container", "Please name your data before saving", 3000);
                        }
                        else {
                            $(".read-container").removeClass("orange");
                            self.setError(".read-container", "Please name your data before saving", 3000);
                        }
                    }
                    else {
                        var m = "save";
                        m += $("#data-name").val();
                        self.port.postMessage(m);
                    }
                }
            };
            this.discardData = function (e, self) {
                var that = $(e.srcElement);
                if (!self.hasData) {
                    self.setError(e.srcElement.className, "No data to " + $(that).html(), 3000);
                }
                else { }
            };
            this.changeTheme = function (e, self) {
                var color;
                var hover;
                if ($(e.srcElement).hasClass("cg-blue")) {
                    self.changeColor("#2C82C9", "#2368a0");
                    color = "#2C82C9";
                    hover = "#2368a0";
                }
                else if ($(e.srcElement).hasClass("cg-green")) {
                    self.changeColor("#2ecc71", "#24a35a");
                    color = "#2ecc71";
                    hover = "#24a35a";
                }
                else if ($(e.srcElement).hasClass("cg-red")) {
                    self.changeColor("#D64541", "#ab3734");
                    color = "#D64541";
                    hover = "#ab3734";
                }
                chrome.storage.sync.set({ color: { color: color, hover: hover } });
            };
            this.arrowClick = function (e, self) {
                self.d = self.openDisplay ? 0 : 180;
                self.h = self.openDisplay ? 0 : 140;
                $("#arrow").velocity({
                    rotateZ: self.d + "deg"
                }, 500);
                $("#console").velocity({
                    height: self.h + "px"
                }, 500);
                self.openDisplay = !self.openDisplay;
            };
            this.removeData = function (key, self) {
                bootbox.confirm({
                    message: "Are you sure?",
                    callback: function (result) {
                        if (result) {
                            self.port.postMessage("remove" + key);
                        }
                    },
                    buttons: {
                        'cancel': {
                            label: 'Cancel',
                            className: 'bootbox-cancel-button'
                        },
                        'confirm': {
                            label: 'Ok',
                            className: 'bootbox-ok-button'
                        }
                    }
                });
            };
            this.setError = function (element, errMessage, errDuration) {
                $(element).addClass("red");
                $(element).attr("data-original-title", errMessage);
                $(element).tooltip({ trigger: 'manual' }).tooltip('enable').tooltip('show');
                setTimeout(function () {
                    $(element).tooltip({ trigger: 'manual' }).tooltip('disable').tooltip('hide');
                    $(element).removeClass("red");
                    $(element).attr("data-original-title", "");
                    $(element).blur();
                }, errDuration);
            };
            this.changeColor = function (color, hover) {
                var cssStr = "header\n         {\n            background-color: " + color + ";\n         }\n\n       .bottom-section {\n            border-top: 1px solid " + color + ";\n        }\n\n        .bottom-section > div:first-child {\n            border: 1px solid " + color + ";\n        }\n\n        .bottom-section > div:first-child > button {\n            background-color: " + color + ";\n        }\n        \n        .bottom-section > div:first-child > button:hover {\n                background-color: " + hover + ";\n        }\n\n        .bottom-section > .middle > button {\n            background-color: " + color + ";\n        }\n\n        .bottom-section > div:last-child {\n            border: 1px solid " + color + ";\n        }\n\n        .bottom-section > div:last-child > div:first-child {\n            background-color: " + color + ";\n        }\n\n        .bottom-section > div:last-child > div:first-child > button {\n            background-color: " + color + ";\n        }\n\n        .select2-container--default .select2-selection--single{\n            border: 1px solid " + color + ";\n            background-color: " + color + ";\n        }\n\n        .select2-container--default .select2-search--dropdown .select2-search__field{\n            border: 1px solid " + color + ";\n        }\n\n        .select2-dropdown{\n            border: 1px solid " + color + ";\n        }\n\n        .select2-container--default .select2-results__option--highlighted[aria-selected]{\n            background-color: " + color + ";\n        }\n        \n        .btn-primary{\n            background-color: " + color + ";\n            border-color: " + hover + ";\n        }\n        \n        .btn-primary:hover{\n            background-color: " + hover + "\n        }\n        \n        .bootbox-ok-button{\n            background-color: " + color + "\n        }\n        \n        .bootbox-ok-button:hover{\n            background-color: " + hover + "\n        }\n\n        .modal-body{\n            background-color: " + color + "\n        }\n\n        ";
                var head = document.head || document.getElementsByTagName('head')[0];
                //var style = head.getElementsByTagName("style")[0];
                var style = head.getElementsByTagName("style")[0];
                style.type = 'text/css';
                if (style.style) {
                    $(style).html("");
                    $(style).text(cssStr);
                }
                else {
                    $(style).html("");
                    style.appendChild(document.createTextNode(cssStr));
                }
                // head.appendChild(style);
            };
            this.port = chrome.runtime.connect({ name: "readPort" });
            this.hasData = false;
            this.openDisplay = false;
            this.d = -180;
            this.h = 0;
            this.InitializeApp(this);
        }
        return FormBot;
    })();
    FormBotApp.FormBot = FormBot;
})(FormBotApp || (FormBotApp = {}));
(function () {
    new FormBotApp.FormBot();
})();
