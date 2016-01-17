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
            chrome.storage.sync.get(function(val: {ColorStr:string}) {
                if (!val) {
                    chrome.storage.sync.set({ ColorStr: "D64541_ab3734_f6d9d9_eeb4b3_f6d9d9" });
                    self.changeColor("D64541_ab3734_f6d9d9_eeb4b3_f6d9d9".split("_"));
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

        private previewData = (key: string, self: FormBot) => {
            self.port.postMessage("preview" + key);
        }

        private bindChromeEvents = (self: FormBot) => {
            self.port.onMessage.addListener(function(msg: string) {
                self.chromeMessageListener(msg, self);
            });
        }

        private bindDOMEvents = (self: FormBot) => {
            $("#arrow").bind("click",function(e:JQueryMouseEventObject){self.arrowClick(e,self);});
            $(".color").bind("click",function(e:JQueryMouseEventObject){self.changeTheme(e,self);});
            $(".save").bind("click",function(e:JQueryMouseEventObject){self.saveData(e,self);});
            $(".discard").bind("click",function(e:JQueryMouseEventObject){self.discardData(e,self);});
            $("#read-button").bind("click",function(e:JQueryMouseEventObject){self.readData(e,self);});
            $(".select2").bind("click",function(e:JQueryMouseEventObject){self.select2ClickEvent(e,self);});
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

        select2ClickEvent = (e: JQueryMouseEventObject, self: FormBot) => {
            $('.select2-results__options').perfectScrollbar();
            $('.select2-results__options').perfectScrollbar("update");
        }

        readData = (e: JQueryMouseEventObject, self: FormBot) => {
            self.port.postMessage("read");
        }

        saveData = (e: JQueryMouseEventObject, self: FormBot) => {
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

        discardData = (e: JQueryMouseEventObject, self: FormBot) => {
            var that = $(e.srcElement);
            if (!self.hasData) {
                self.setError(e.srcElement.className, "No data to " + $(that).html(), 3000);
            }
            else { }
        }
        
        
        changeTheme = (e: JQueryMouseEventObject, self: FormBot) => {
            console.log(e.originalEvent.srcElement);
            self.changeColor($(e.originalEvent.srcElement).attr("colors").split("_"));
            chrome.storage.sync.set({ ColorStr : $(e.originalEvent.srcElement).attr("colors").toString() });
        }

        arrowClick = (e: JQueryMouseEventObject, self: FormBot) => {
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
                callback: function(result: boolean) {if (result) {self.port.postMessage("remove" + key);}},
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

        changeColor = (colorStr:string[]) => {
        var color = "#" + colorStr[0];
        var hover = "#" + colorStr[1];
        var odd = "#" + colorStr[2];
        var even = "#" + colorStr[3]; 
        var background = "#" + colorStr[4];   
        var cssStr = `
        body{
            background-color: `+background+`
        }
        
        header
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
        
        .bottom-section > .middle > button:hover {
            background-color: `+ hover + `;
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
        
        .write-button{
            background-color: `+color+`;
        }

        .write-button:hover{
            background-color: `+hover+`;
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
