import { SEARCH_TYPE_REGEXP, STOP_TRAVEL } from '../config/constant';
const toString = Object.prototype.toString;

export function escapeRegExp( text ) {
    // <https://github.com/sindresorhus/escape-string-regexp>
    if ( Object.prototype.toString.call( text ) != '[object String]' ) {
        throw new Error( 'escapeRegExp(): text must be a string' );
    }
    return text.replace( /[|\\{}().^$[\]*+?]/g, '\\$&' );
}

export function matchSelectors( node, selectors ) {
    var isMatched = false;
    var selector;
    selectors = selectors || [];

    if ( ! node ) { 
        throw new Error( 'matchSelectors( node, selectors ): invalid argument - node' );
    }

    for ( var i = 0; i < selectors.length; i++ ) {
        selector = selectors[ i ];
        if ( /^#(.+)/.test( selector ) ) {
            if ( node.id == RegExp.$1 ) {
                isMatched = true;
                break;
            }
        }
        else if ( /^\.(.+)/.test( selector ) ) {
            var className = RegExp.$1;
            /**
             * Note: there is a bug when node is an `svg`: `if ( node.className ) ...`
             *  1. Object.prototype.toString.call( svgDOM.tagName ) == '[object SVGAnimatedString]'
             *  2. typeof svgDOM.className == object
             *  3. svgDOM.className.split is not a function
             */
            if ( typeof node.className == 'string'
                && node.className.split( /\s+/ ).indexOf( className ) >= 0 ) {
                isMatched = true;
                break;
            } 
        }
        else if ( Object.prototype.toString.call( selector ) == '[object RegExp]' ) {
            if ( node.tagName 
                && selector.test( node.tagName ) ) {
                isMatched = true;
                break;
            }
        }
        else {
            if ( node.tagName 
                && selector == node.tagName.toLowerCase() ) {
                isMatched = true;
                break;
            }
        }
    } 

    return isMatched;
}

export function splitText( text, splitter, options ) {

    var opt = options || {};
    var reg;

    if ( opt.type == SEARCH_TYPE_REGEXP ) {
        reg = new RegExp( splitter, 'i' );
    } 
    else {
        // Note: modifier 'g' here will trigger a bug
        // var reg = new RegExp( escapeRegExp( splitter ), 'ig' );
        reg = new RegExp( escapeRegExp( splitter ), 'i' );
    }

    var textArr = text.split( reg ); 
    var keysArr = [], f, t, i, start, end, key, lastIndex = 0;

    /**
     * the way below has a bug:
     *     text     splitter    textArr              keysArr 
     *     ==========================================================
     *     s        s        => [ "", "" ]           [ "" ]
     *     ss       s        => [ "", "", "" ]       [ "", "" ]
     *     as       s        => [ "a", "" ]          [ "" ]
     *     asbs     s        => [ "a", "b", "" ]     [ "s", "" ]
     */
    // if ( textArr.length > 1 ) {
    //     for ( i = 0; i < textArr.length - 1; i++ ) {
    //         f = textArr[ i ];
    //         t = textArr[ i + 1 ];
    //         start = lastIndex + f.length;
    //         end = text.indexOf( t, start );
    //         keysArr.push( text.substring( start, end ) );
    //         lastIndex = end;
    //     }
    // }

    /**
     * the bug-free way
     */
    if ( textArr.length > 1 ) {
        var tmpText = text;
        for ( i = 0; i < textArr.length - 1; i++ ) {
            f = textArr[ i ];
            start = f.length;
            tmpText = tmpText.substring( start );
            if ( ! reg.test( tmpText ) ) {
                throw new Error( 'splitText( text, splitter ): an error occured' );
            }
            key = RegExp[ '$&' ];
            keysArr.push( key );
            tmpText = tmpText.substr( key.length );
        }
    }

    return {
        textArr: textArr
        , keysArr: keysArr
    };
}

function defaultVisit( node ) {
    console.log(
        node.nodeName
        + ' | ' + node.nodeValue
        + ' | ' +  node.tagName
    );
}

export function preDepthTravel( node, options ) {
    var opt = options || {};
    var visit = opt.visit || defaultVisit;
    var childNodes = node.childNodes;
    var result = visit( node );

    // if STOP_TRAVEL, no traverse descendants
    if ( STOP_TRAVEL == result ) {
        return 0;
    }

    // if 0, childNodes no changed
    // if more than 0, there are new child nodes added
    for ( var i = 0; i < childNodes.length; i++ ) {
        i += preDepthTravel( childNodes[ i ], opt );
    }

    return result;
}

// check if all children are text nodes
export function allTextChildren( node ) {
    var textChildren = true;

    if ( ! node ) {
        throw new Error( 'allTextChildren( node ): node argument not supplied' );
    }

    if ( ! node.childNodes || ! node.childNodes.length ) {
        return false;
    }

    for ( var i = 0; i < node.childNodes.length; i++ ) {
        var child = node.childNodes[ i ];
        if ( child.nodeType != 3 ) {
            textChildren = false;
            break;
        }
    }

    return textChildren;
}

export function isArray( obj ) {
    return toString.apply( obj ) == '[object Array]';
}

export function isNumber( obj ) {
    return toString.apply( obj ) == '[object Number]';
}

export function isString( obj ) {
    return toString.apply( obj ) == '[object String]';
}

export function isObject( obj ) {
    return toString.apply( obj ) == '[object Object]';
}

export function isRegExp( obj ) {
    return toString.apply( obj ) == '[object Object]';
}

