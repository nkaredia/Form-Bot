/// <reference path="./Typings/jquery/jquery.d.ts"/>
/// <reference path="./Typings/chosen.jquery.d.ts"/>

$(document).ready(function(){
    console.log("sdsf");   
    $(".chosen-select").chosen();
    console.log($(".chosen-container").removeAttr("style"));
    
});
