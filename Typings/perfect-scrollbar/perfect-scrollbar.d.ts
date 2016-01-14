/// <reference path="../jquery/jquery.d.ts"/>

interface perfectScrollbarOptions{
    wheelSpeed?: number;
    wheelPropagation?: boolean;
    swipePropagation?: boolean;
    minScrollbarLength?: number | {null};
    maxScrollbarLength?: number | {null};
    useBothWheelAxes?: boolean;
    useKeyboard?: boolean;
    suppressScrollX?: boolean;
    suppressScrollY?: boolean;
    scrollXMarginOffset?: number;
    scrollYMarginOffset?: number;
    stopPropagationOnClick?: boolean;
    useSelectionScroll?: boolean;
}



interface JQuery {
    perfectScrollbar(): JQuery;
    perfectScrollbar(options: perfectScrollbarOptions)
    perfectScrollbar(option:string);
    
}

declare var perfectScrollbar;