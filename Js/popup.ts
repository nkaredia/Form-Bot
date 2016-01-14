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

module FormBotApp {
    interface Color {
        color: {
            color: string,
            hover: string,
            even: string,
            odd: string
        }
    }

    export class FormBot {
        port: chrome.runtime.Port;
        hasData: boolean;
        openDisplay: boolean;
        //preview_window_open:boolean;
        d: number;
        h: number;
        constructor() {
            this.port = chrome.runtime.connect({ name: "readPort" });
            this.hasData = false;
            this.openDisplay = false;
            this.d = -180;
            this.h = 0;
            //this.preview_window_open = false;
            this.InitializeApp(this);

        }

        private InitializeApp = (self: FormBot) => {
            chrome.storage.sync.get(function(val: Color) {
                if (!val) {
                    chrome.storage.sync.set({ color: { color: "#D64541", hover: "#ab3734", odd: "#f6d9d9", even: "#eeb4b3" } });
                    self.changeColor("#D64541","#ab3734","#f6d9d9","#eeb4b3");
                }
                else {
                    // this.changeColor(val.color.color.toString(), val.color.hover.toString());
                    self.changeColor(val.color.color.toString(), val.color.hover.toString(), val.color.odd.toString(), val.color.even.toString());
                }
            });
            self.bindChromeEvents(self);
            self.InitializeSelect2(self);
            $('.select2').removeAttr("style");
            self.bindDOMEvents(self);
            self.port.postMessage("getData");
            $("#console").perfectScrollbar();
        }

        private InitializeSelect2 = (self: FormBot) => {
            $(".dt-select").select2({
                placeholder: "Choose to insert...",
                templateResult: function(data) {
                    if (data.id == null) {
                        return data.text;
                    }

                    var $option = $("<span></span>");
                    var $preview = $("<span class='option-control-container'><span class='preview-data glyphicon glyphicon-eye-open'></span><button class='remove-data glyphicon glyphicon-remove'></button></span>");
                    $preview.prop("id", data.id);
                    $preview.on('mouseup', function(evt) {
                        // Select2 will remove the dropdown on `mouseup`, which will prevent any `click` events from being triggered
                        // So we need to block the propagation of the `mouseup` event
                        evt.stopPropagation();
                    });

                    $preview.find('.remove-data,.preview-data').on('click', function(evt: MouseEvent) {
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
        }

        private previewData(key: string, self: FormBot) {
            self.port.postMessage("preview" + key);
        }

        private bindChromeEvents = (self: FormBot) => {
            self.port.onMessage.addListener(function(msg: string) {
                self.chromeMessageListener(msg, self);
            });
        }

        private bindDOMEvents = (self: FormBot) => {
            document.getElementById("arrow").addEventListener("click", function(e) {
                self.arrowClick(e, self);
            });
            Array.prototype.slice.call(document.getElementsByClassName("color"))
                .forEach(function(el) {
                    el.addEventListener("click", function(e) {
                        self.changeTheme(e, self);
                    });
                });
            Array.prototype.slice.call(document.getElementsByClassName("save"))
                .forEach(function(el) {
                    el.addEventListener("click", function(e) {
                        self.saveData(e, self);
                    });
                });
            Array.prototype.slice.call(document.getElementsByClassName("discard"))
                .forEach(function(el) {
                    el.addEventListener("click", function(e) {
                        self.discardData(e, self);
                    });
                });
            document.getElementById("read-button").addEventListener("click", function(e) {
                self.readData(e, self);
            });
            Array.prototype.slice.call(document.getElementsByClassName("select2"))
                .forEach(function(el) {
                    el.addEventListener("click", function(e) {
                        self.select2ClickEvent(e, self);
                    });
                });
        }

        chromeMessageListener = (msg: any, self: FormBot) => {
            var that = $(".read-container");
            if (msg == "false") {

                self.setError(".read-container", "No data found on this page", 3000);

            } else if (msg.toString().startsWith("saved")) {
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

        }

        select2ClickEvent = (e: MouseEvent, self: FormBot) => {
            $('.select2-results__options').perfectScrollbar();
            $('.select2-results__options').perfectScrollbar("update");
        }

        readData = (e: MouseEvent, self: FormBot) => {
            self.port.postMessage("read");
        }

        saveData = (e: MouseEvent, self: FormBot) => {
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
                } else {
                    var m = "save";
                    m += $("#data-name").val();
                    self.port.postMessage(m);
                }
            }
        }

        discardData = (e: MouseEvent, self: FormBot) => {
            var that = $(e.srcElement);
            if (!self.hasData) {
                self.setError(e.srcElement.className, "No data to " + $(that).html(), 3000);
            }
            else { }
        }

        changeTheme = (e: MouseEvent, self: FormBot) => {
            var color
            var hover;
            var odd;
            var even;
            if ($(e.srcElement).hasClass("cg-blue")) {
                color = "#2C82C9";
                hover = "#2368a0";
                odd = "#d4e6f4";
                even = "#aacde9";
            }
            else if ($(e.srcElement).hasClass("cg-green")) {
                color = "#2ecc71";
                hover = "#24a35a";
                odd = "#d5f4e2";
                even = "#abeac6";
            }
            else if ($(e.srcElement).hasClass("cg-red")) {
                color = "#D64541";
                hover = "#ab3734";
                odd = "#f6d9d9";
                even = "#eeb4b3";
            }
            self.changeColor(color, hover,odd,even);
            chrome.storage.sync.set({ color: { color: color, hover: hover, odd: odd, even: even } });
        }

        arrowClick = (e: MouseEvent, self: FormBot) => {
            self.d = self.openDisplay ? 0 : 180;
            self.h = self.openDisplay ? 0 : 140;
            $("#arrow").velocity({
                rotateZ: self.d + "deg"
            }, 500);
            $("#console").velocity({
                height: self.h + "px"
            }, 500);
            self.openDisplay = !self.openDisplay;
        }

        removeData = (key: string, self: FormBot) => {
            bootbox.confirm({
                message: "Are you sure?",
                callback: function(result: boolean) {
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
        }

        setError = (element: string, errMessage: string, errDuration: number) => {
            $(element).addClass("red");
            $(element).attr("data-original-title", errMessage);


            $(element).tooltip({ trigger: 'manual' }).tooltip('enable').tooltip('show');
            setTimeout(function() {
                $(element).tooltip({ trigger: 'manual' }).tooltip('disable').tooltip('hide');
                $(element).removeClass("red");
                $(element).attr("data-original-title", "");
                $(element).blur();
            }, errDuration);
        }

        changeColor = (color: string, hover: string, odd: string, even: string) => {
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
        
        .bottom-section > div:first-child > button:hover {
                background-color: `+ hover + `;
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
        
        .btn-primary{
            background-color: `+ color + `;
            border-color: `+ hover + `;
        }
        
        .btn-primary:hover{
            background-color: `+ hover + `;
        }
        
        .bootbox-ok-button{
            background-color: `+ color + `;
        }
        
        .bootbox-ok-button:hover{
            background-color: `+ hover + `;
        }

        .modal-body{
            background-color: `+ color + `;
        }
        
        .preview-data:hover,.remove-data:hover{
            color: `+ hover + `;
        }
        
        .preview_window_table tr:nth-child(odd){
            background-color: `+odd+`;
        }

        .preview_window_table tr:nth-child(even){
            background-color: `+even+`;
        }
        

        `;

            var head: HTMLHeadElement = document.head || document.getElementsByTagName('head')[0];
            //var style = head.getElementsByTagName("style")[0];
            var style: HTMLStyleElement = head.getElementsByTagName("style")[0];




            style.type = 'text/css';
            if (style.style) {
                $(style).html("");
                $(style).text(cssStr);
            } else {
                $(style).html("");
                style.appendChild(document.createTextNode(cssStr));
            }

            // head.appendChild(style);

        }
    }
}

(function() {
    new FormBotApp.FormBot();
})();
