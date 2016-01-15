/// <reference path="../Typings/chrome/chrome.d.ts" />
/// <reference path="../Typings/es6-promise/es6-promise.d.ts" />
/// <reference path="../Typings/filesystem/filesystem.d.ts" />
/// <reference path="../Typings/filewriter/filewriter.d.ts" />
/// <reference path="../Typings/webrtc/MediaStream.d.ts" />
/// <reference path="../Typings/bootstrap/bootstrap.d.ts" />
/// <reference path="../Typings/bootbox/bootbox.d.ts" />
/// <reference path="../Typings/velocity-animate/velocity-animate.d.ts" />
/// <reference path="../Typings/perfect-scrollbar/perfect-scrollbar.d.ts" />
/// <reference path="../Typings/select2/select2.d.ts"/>
/// <reference path="../Typings/jquery/jquery.d.ts" />
var FormBotApp;
(function (FormBotApp) {
    var FormBot = (function () {
        function FormBot() {
            this.InitializeApp = function (self) {
                chrome.storage.sync.get(function (val) {
                    if (!val) {
                        chrome.storage.sync.set({ ColorStr: "D64541_ab3734_f6d9d9_eeb4b3" });
                        self.changeColor("D64541_ab3734_f6d9d9_eeb4b3".split("_"));
                    }
                    else {
                        // this.changeColor(val.color.color.toString(), val.color.hover.toString());
                        self.changeColor(val.ColorStr.toString().split("_"));
                    }
                });
                self.bindChromeEvents(self);
                self.InitializeSelect2(self);
                $('.select2').removeAttr("style");
                self.bindDOMEvents(self);
                self.port.postMessage("getData");
                $("#console").perfectScrollbar();
            };
            this.InitializeSelect2 = function (self) {
                $(".dt-select").select2({
                    placeholder: "Choose to insert...",
                    templateResult: function (data) {
                        if (data.id == null) {
                            return data.text;
                        }
                        var $option = $("<span></span>");
                        var $preview = $("<span class='option-control-container'><span class='preview-data glyphicon glyphicon-eye-open'></span><button class='remove-data glyphicon glyphicon-remove'></button></span>");
                        $preview.prop("id", data.id);
                        $preview.on('mouseup', function (evt) {
                            evt.stopPropagation();
                        });
                        $preview.find('.remove-data,.preview-data').on('click', function (evt) {
                            if ($(this).hasClass("remove-data")) {
                                self.removeData(data.text, self);
                            }
                            else if ($(this).hasClass("preview-data")) {
                                self.previewData(data.text, self);
                            }
                        });
                        $option.text(data.text);
                        $option.append($preview);
                        return $option;
                    }
                });
            };
            this.previewData = function (key, self) {
                self.port.postMessage("preview" + key);
            };
            this.bindChromeEvents = function (self) {
                self.port.onMessage.addListener(function (msg) {
                    self.chromeMessageListener(msg, self);
                });
            };
            this.bindDOMEvents = function (self) {
                /*document.getElementById("arrow").addEventListener("click", function(e) {
                    self.arrowClick(e, self);
                });*/
                $("#arrow").bind("click", function (e) { self.arrowClick(e, self); });
                /*Array.prototype.slice.call(document.getElementsByClassName("color"))
                    .forEach(function(el) {
                        el.addEventListener("click", function(e) {
                            self.changeTheme(e, self);
                        });
                    });*/
                $(".color").bind("click", function (e) { self.changeTheme(e, self); });
                /* Array.prototype.slice.call(document.getElementsByClassName("save"))
                     .forEach(function(el) {
                         el.addEventListener("click", function(e) {
                             self.saveData(e, self);
                         });
                     });*/
                $(".save").bind("click", function (e) { self.saveData(e, self); });
                /*Array.prototype.slice.call(document.getElementsByClassName("discard"))
                    .forEach(function(el) {
                        el.addEventListener("click", function(e) {
                            self.discardData(e, self);
                        });
                    });*/
                $(".discard").bind("click", function (e) { self.discardData(e, self); });
                /* document.getElementById("read-button").addEventListener("click", function(e) {
                     self.readData(e, self);
                 });*/
                $("#read-button").bind("click", function (e) { self.readData(e, self); });
                /*Array.prototype.slice.call(document.getElementsByClassName("select2"))
                    .forEach(function(el) {
                        el.addEventListener("click", function(e) {
                            self.select2ClickEvent(e, self);
                        });
                    });*/
                $(".select2").bind("click", function (e) { self.select2ClickEvent(e, self); });
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
                    if (self.openDisplay) {
                        $("#arrow").click();
                    }
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
                else if (msg.toString().startsWith("preview")) {
                    var s = msg.toString().slice(7, msg.toString().length);
                    $(".data-display").html("");
                    $(".data-display").html(s);
                    if (!self.openDisplay) {
                        $("#arrow").click();
                        $("#console").perfectScrollbar();
                    }
                    $("#console").perfectScrollbar('update');
                }
                else if ("string" == typeof (msg)) {
                    $(".data-display").html(msg);
                    if (!self.openDisplay) {
                        $("#arrow").click();
                    }
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
                console.log(e.originalEvent.srcElement);
                self.changeColor($(e.originalEvent.srcElement).attr("colors").split("_"));
                chrome.storage.sync.set({ ColorStr: $(e.originalEvent.srcElement).attr("colors").toString() });
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
            this.changeColor = function (colorStr) {
                var color = "#" + colorStr[0];
                var hover = "#" + colorStr[1];
                var odd = "#" + colorStr[2];
                var even = "#" + colorStr[3];
                var cssStr = "header\n        {\n           background-color: " + color + ";\n        }\n\n        .bottom-section {\n            border-top: 1px solid " + color + ";\n        }\n\n        .bottom-section > div:first-child {\n            border: 1px solid " + color + ";\n        }\n\n        .bottom-section > div:first-child > button {\n            background-color: " + color + ";\n        }\n        \n        .bottom-section > div:first-child > button:hover {\n                background-color: " + hover + ";\n        }\n\n        .bottom-section > .middle > button {\n            background-color: " + color + ";\n        }\n\n        .bottom-section > div:last-child {\n            border: 1px solid " + color + ";\n        }\n\n        .bottom-section > div:last-child > div:first-child {\n            background-color: " + color + ";\n        }\n\n        .bottom-section > div:last-child > div:first-child > button {\n            background-color: " + color + ";\n        }\n\n        .select2-container--default .select2-selection--single{\n            border: 1px solid " + color + ";\n            background-color: " + color + ";\n        }\n\n        .select2-container--default .select2-search--dropdown .select2-search__field{\n            border: 1px solid " + color + ";\n        }\n\n        .select2-dropdown{\n            border: 1px solid " + color + ";\n        }\n\n        .select2-container--default .select2-results__option--highlighted[aria-selected]{\n            background-color: " + color + ";\n        }\n        \n        .btn-primary{\n            background-color: " + color + ";\n            border-color: " + hover + ";\n        }\n        \n        .btn-primary:hover{\n            background-color: " + hover + ";\n        }\n        \n        .bootbox-ok-button{\n            background-color: " + color + ";\n        }\n        \n        .bootbox-ok-button:hover{\n            background-color: " + hover + ";\n        }\n\n        .modal-body{\n            background-color: " + color + ";\n        }\n        \n        .preview-data:hover,.remove-data:hover{\n            color: " + hover + ";\n        }\n        \n        .preview_window_table tr:nth-child(odd){\n            background-color: " + odd + ";\n        }\n\n        .preview_window_table tr:nth-child(even){\n            background-color: " + even + ";\n        }\n        \n\n        ";
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
            //this.preview_window_open = false;
            this.InitializeApp(this);
        }
        return FormBot;
    })();
    FormBotApp.FormBot = FormBot;
})(FormBotApp || (FormBotApp = {}));
(function () {
    new FormBotApp.FormBot();
})();
