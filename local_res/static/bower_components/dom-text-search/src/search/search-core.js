import $ from 'jquery';
import { STOP_TRAVEL } from '../config/constant';
import { 
    matchSelectors, splitText
    , preDepthTravel, allTextChildren 
} from '../utils';
import { searchStyle
    , searchTextStyle
    , searchHighlightStyle
    , searchElementHighlightStyle
    , searchHideStyle
    , infoStyle
    , infoCurrentStyle
    , infoSplitterStyle
    , infoTotalStyle
} from '../style';

function doSelectorSearch( selector, options ) {
    var opt = options;
    var $root = $( document.body );
    var $results = $( selector, $root[ 0 ] )
        .filter( function( index ) {
            if ( matchSelectors( this, opt.highlightExcludes ) ) {
                return false;
            }
            return true;
        } )
        ;

    if ( ! $results.length ) {
        return false;
    }

    // highlight
    $results.addClass( searchElementHighlightStyle );

    // hide
    if ( opt.hideNoMatchedItems ) {
        preDepthTravel( $root[ 0 ], {
            visit: function( node ) {
                if ( matchSelectors( node, opt.hideExcludes ) 
                    // #text nodes ignored
                    || node.nodeType == 3 ) {
                    return STOP_TRAVEL;
                }

                var $node = $( node );
                var className = searchElementHighlightStyle;
                if ( ! $node.find( '.' + className ).length 
                    && ! $node.hasClass( className )
                    ) {
                    $node.addClass( searchHideStyle );
                    return STOP_TRAVEL;
                }
                else if ( $node.hasClass( className ) ) {
                    return STOP_TRAVEL;
                }
                return 0;
            }
        } );
    }
    
    return true;
}

function doContentSearch( text, options ) {
    var opt = options || {};
    var $root = $( document.body );
    var hasMatched = false;

    // todo: opt validation

    preDepthTravel( $root[ 0 ], {
        visit: function( node ) {
            if ( matchSelectors( node, opt.highlightExcludes ) ) {
                return STOP_TRAVEL;
            }

            if ( node.nodeType == 3 ) { 
                var rawText = node.nodeValue;

                var splitResult = splitText( rawText, text, opt );
                var textArr = splitResult.textArr;
                // the original keywords
                var keysArr = splitResult.keysArr;

                var newNodes = [];
                var parentNode = node.parentNode;
                if ( textArr.length > 1 ) {
                    hasMatched = true;
                    for ( var i = 0; i < textArr.length; i++ ) {
                        newNodes.push( document.createTextNode( textArr[ i ] ) );
                        if ( i < textArr.length - 1 ) {
                            var spanNode = document.createElement( 'span' );
                            var innerTextNode = document.createTextNode( keysArr[ i ] );
                            spanNode.appendChild( innerTextNode );
                            spanNode.className = searchHighlightStyle;
                            newNodes.push( spanNode );
                        }
                    }

                    for( i = 0; i < newNodes.length; i++ ) {
                        parentNode.insertBefore( newNodes[ i ], node );
                    }

                    parentNode.removeChild( node );
                    return newNodes.length - 1;
                }
            }
            return 0;
        }
    } );

    // if no matched, we don't need to hide no-matched elements
    if ( ! hasMatched ) {
        return false;
    }

    // hide
    if ( opt.hideNoMatchedItems ) {
        preDepthTravel( $root[ 0 ], {
            visit: function( node ) {
                if ( matchSelectors( node, opt.hideExcludes ) 
                    // #text nodes ignored
                    || node.nodeType == 3 ) {
                    return STOP_TRAVEL;
                }

                var $node = $( node );
                var className = searchHighlightStyle;
                if ( ! $node.find( '.' + className ).length 
                    && ! $node.hasClass( className )
                    ) {
                    // console.log( node.tagName + ', ' + node.nodeName );
                    var display = $node.css( 'display' );

                    if ( ! allTextChildren( node ) 
                        || display != 'inline' 
                            && display != 'inline-block'
                        ) {
                        $node.addClass( searchHideStyle );
                    }
                    // do not hide inline elements those have only text child nodes
                    else {
                        // console.log( 'allTextChildren: ' + node.nodeType );
                    }
                    return STOP_TRAVEL;
                }
                return 0;
            }
        } );
    }

    return true;
}

function restore( options ) {
    var opt = options || {};
    var $root = $( document.body );

    preDepthTravel( $root[ 0 ], {
        visit: function( node ) {
            if ( node.tagName && node.tagName.toLowerCase() == 'span'
                && node.className.split( /\s+/ ).indexOf( searchHighlightStyle ) >= 0 
                ) {
                var t1 = node.childNodes[ 0 ];
                var t2 = node.previousSibling;
                var t3 = node.nextSibling;
                if ( t1.childNodes.length > 1
                    || ! t2 
                    || ! t3
                    ) {
                    throw new Error( 'restore(): an error occured' );
                }
                t2.nodeValue += t1.nodeValue + t3.nodeValue;
                node.parentNode.removeChild( node );
                t3.parentNode.removeChild( t3 );

                // we discard 2 nodes
                return -1;
            }
            else if ( 'string' == typeof node.className ) {
                var arr = node.className.split( /\s+/ ), classIndex;
                if ( ( classIndex = arr.indexOf( searchElementHighlightStyle ) ) >= 0 ) {
                    arr.splice( classIndex, 1 );
                    if ( ! arr.length ) {
                        node.removeAttribute( 'class' );
                    }
                    else {
                        node.setAttribute( 'class', arr.join( ' ' ) );
                    }
                }
            }
            return 0;
        }
    } );

    if ( opt.keepHiddenItems ) {
        return;
    }

    $( '.' + searchHideStyle )
        .removeClass( searchHideStyle )
        ;
}

export {
    doContentSearch
    , doSelectorSearch
    , restore
};

