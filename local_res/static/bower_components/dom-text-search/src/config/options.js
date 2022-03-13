import $ from 'jquery';
import { isArray, isObject } from '../utils';
import { 
    searchStyle
    , searchTextStyle
    , searchHighlightStyle
    , searchElementHighlightStyle
    , searchHideStyle
    , infoStyle
    , infoCurrentStyle
    , infoSplitterStyle
    , infoTotalStyle
} from '../style';



const highlightExcludes = [
    '.' + searchStyle
    , '.' + infoStyle
    , '.' + searchHideStyle
    , '.' + infoCurrentStyle
    , '.' + infoTotalStyle
    , '.' + infoSplitterStyle
    , /style|script|iframe|input|textarea|svg|canvas/i
];
const hideExcludes = [
    '.' + searchStyle
    , '.' + infoStyle
    , '.' + searchHideStyle
    , /style|script|iframe|h[1-7]/i
];
const uniqueArray = $.unique || $.uniqueSort;

let options = {
    highlightExcludes: highlightExcludes.slice() 
    , hideExcludes: hideExcludes.slice()
    , hideNoMatchedItems: false
};

function get() {
    return options;
}

function merge( newOptions ) {
    newOptions = newOptions || {};
    for ( let i in newOptions ) {
        if ( isArray( options[ i ] ) && isArray( newOptions[ i ] ) ) {
            options[ i ] = uniqueArray( options[ i ].concat( newOptions[ i ] ) );
        }
        else if ( isObject( options[ i ] ) && isObject( newOptions ) ) {
            options[ i ] = $.extend( {}, options[ i ], newOptions[ i ] );
        }
        else {
            options[ i ] = newOptions[ i ];
        }
    }
    return options;
}

export { merge };
