/// <reference path="../../Typings/chrome/chrome.d.ts" />
/// <reference path="../../Typings/jquery/jquery.d.ts" />
var queryString = ":input:visible[type='text'],:input:visible[type='number'],:input:visible[type='checkbox'],:input:visible[type='radio'],:input:visible[type='date'],:input:visible[type='color'],:input:visible[type='range'],:input:visible[type='month'],:input:visible[type='week'],:input:visible[type='time'],:input:visible[type='datetime'],:input:visible[type='datetime-local'],:input:visible[type='email'],:input:visible[type='search'],:input:visible[type='tel'],:input:visible[type='url'],select:visible,textarea:visible";
chrome.runtime.onMessage.addListener(function (request, sender, sr) {
    if (request.message == "read") {
        var _position_id = 0;
        var msg = [];
        $(queryString).filter(function(){
           // console.log($(this));
            var bool = false;
            if($(this)[0].type == "checkbox" || $(this)[0].type == "radio"){
                if($(this)[0].checked){
                    $(this).attr("checked", "checked");
                    bool = true;
                }
            }
            else if($(this)[0].localName == "input" || $(this)[0].localName == "select" || $(this)[0].localName == "textarea"){
                if($(this)[0].value != ""){
                    $(this).attr("value", $(this).val());
                    bool = true;
                }
            }
            $(this).attr("_fbt_position_id", _position_id++);
            if(bool){
                msg.push($(this)[0].outerHTML);
            }
            return bool;
        });
        
        if(msg.length > 0){
            console.log(msg);
            sr({message: msg});
        }
        else{
            sr({message: "false"});
        }
    }
});
function isToggleInput(i) {
  //  console.log(i.type == "checkbox" || i.type == "radio" ? true : false);
    return i.type == "checkbox" || i.type == "radio" ? true : false;
}