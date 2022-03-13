import $ from 'jquery';
import { regRegExpPrefix, regSelectorPrefix } from '../config';
import { merge as mergeOptions } from '../config/options';
import { doContentSearch, doSelectorSearch, restore } from './search-core';
import { setState, getState } from './search-state';
import { update as updateSearchInfo, close as closeSearchInfo } from './search-info';
import { currentResultIndex, gotoSearchResult } from './search-result-navi';
import { 
    SEARCH_TYPE_SELECTOR, SEARCH_TYPE_REGEXP, SEARCH_TYPE_TEXT
    , SELECTOR_PREFIX, REGEXP_PREFIX
    , STATE_NORMAL, STATE_AFTER_SEARCH
    , STATE_SEARCHING, STATE_BEFORE_SEARCH 
} from '../config/constant';
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

let _closeSearch = null;
let lastKeyIsSlash = false;
let timerForSlash;

function openSearch( options ) {
    let opt = options || {};
    let $body = $( document.body );
    let $searchBar = $( '#content-search' );
    let placeholder = '';

    if ( opt.type == SEARCH_TYPE_SELECTOR ) {
        placeholder = 'Selector Search';
    }
    else if ( opt.type == SEARCH_TYPE_REGEXP ) {
        placeholder = 'Regular Expression Search';
    }
    else {
        placeholder = 'Text Search';
    }


    if ( ! $searchBar.length ) {
        $searchBar = $(
            '<div id="content-search" class="row ' + searchStyle + '">'
            + '<div class="col">'
            + '<input class="form-control ' + searchTextStyle + '" type="text">'
            + '</div>'
            + '</div>'
        );
        $body.append( $searchBar );
    }

    let $searchInput = $searchBar.find( 'input' );
    $searchInput.attr( 'placeholder', placeholder ).val( '' );
    $searchBar.show().fadeIn();

    // console.log( 'search type: ' + opt.type );
    // if ( opt.type == SEARCH_TYPE_SELECTOR ) {
    //     $searchInput.val( SELECTOR_PREFIX );
    // }
    // else if ( opt.type == SEARCH_TYPE_REGEXP ) {
    //     $searchInput.val( REGEXP_PREFIX );
    // }
    // else {
    //     $searchInput.val( '' );
    // }
    //
    setTimeout( () => $searchInput.focus(), 0 );

    $searchInput.on( 'keydown', function( e ) {
        let RETURN = 13, keyCode = e.keyCode || e.which;
        if ( keyCode == RETURN ) {
            // state transformation
            setState( STATE_SEARCHING );

            // initialize search info
            updateSearchInfo();

            let result = doSearch( this.value, opt );

            // bugfix for reopening the search bar
            this.blur();

            closeSearch();

            // state transformation
            setState( STATE_AFTER_SEARCH );
        }
    } );

    _closeSearch = _closeSearch || function() {
        $searchBar.fadeOut();
        $searchInput.off( 'keydown' );
    };
}

function closeSearch() {
    _closeSearch && _closeSearch();
}

function prepareToSearch( options ) {
    var opt = options || {};

    opt = mergeOptions( opt );

    openSearch( opt );

    updateSearchInfo();

    /**
     * support searching again in last result,
     * we restore the dom tree, but keep the hidden items hidden
     * , then the new searched result will not contain the hidden items
     * of last search
     */
    restore( { keepHiddenItems: true } );

    // state transformation
    setState( STATE_BEFORE_SEARCH );
}

function showSibling( node ) {
    var $node = $( node );
    var $prev = $node.prev()
        , $next = $node.next()
        , hide = searchHideStyle
        ;

    if ( $prev.hasClass( hide ) ) {
        $prev
            .removeClass( hide )
            .animateCss( 'fadeIn' )
            ;
    }

    if ( $next.hasClass( hide ) ) {
        $next
            .removeClass( hide )
            .animateCss( 'fadeIn' )
            ;
    }
}

function onDocumentClick( e ) {
    if ( getState() != STATE_AFTER_SEARCH
        || ! e.altKey ) {
        return;
    }
    showSibling( e.target );
}

function onDocumentKeyDown( e ) {

    var SLASH = 191, ESC = 27, N_KEY = 78;
    var keyCode = e.keyCode || e.which;
    var tagName = e.target.tagName || '';

    if ( keyCode == ESC 
        && getState() != STATE_NORMAL ) {
        // back to normal state
        restore();

        // bugfix for reopening the search bar
        $( '#content-search input' ).blur();
        closeSearch();
        closeSearchInfo();

        // state transformation
        setState( STATE_NORMAL );
    }

    if ( /input|textarea/i.test( tagName ) ) {
        // Slash-key state transformation
        // lastKeyIsSlash = false;
        return;
    }

    if ( keyCode == SLASH ) {
        if ( e.shiftKey ) {
            // console.log( ' = do selector search' );
            prepareToSearch( { type: SEARCH_TYPE_REGEXP } ); 
        }
        else if ( e.ctrlKey ) {
            prepareToSearch( { type: SEARCH_TYPE_SELECTOR } ); 
        }
        // else if ( ! lastKeyIsSlash ) {
        //     // Slash-key state transformation
        //     lastKeyIsSlash = true;

        //     timerForSlash = setTimeout( function() {
        //         // console.log( ' = do content search' );

        //         // Slash-key state transformation
        //         lastKeyIsSlash = false;

        //         prepareToSearch( { type: SEARCH_TYPE_TEXT } );
        //     }, 300 );

        //     // update state and leave
        //     return;
        // }
        else {
            // clearTimeout( timerForSlash );
            // console.log( ' = do regexp content search' );
            // prepareToSearch( { type: SEARCH_TYPE_REGEXP } ); 
            prepareToSearch( { type: SEARCH_TYPE_TEXT } );
        }
    }

    // Slash-key state transformation
    // lastKeyIsSlash = false;

    // search results navigation
    if ( keyCode == N_KEY
        && getState() == STATE_AFTER_SEARCH
        ) {
        if ( e.shiftKey ) {
            gotoSearchResult( { operation: -1 } );
        }
        else {
            gotoSearchResult( { operation: 1 } );
        }
    }

}



function doSearch( text, options ) {
    var opt = options || {};
    var $root = $( document.body );
    var searchResult;

    // console.log( 'doSearch: ' + text );
    //
    if ( regSelectorPrefix.test( text ) ) {
        text = RegExp.$1;
    } 
    else if ( regRegExpPrefix.test( text ) ) {
        text = RegExp.$1;
    }

    // if empty keyword, stop go further
    if ( ! text.replace( /^\s+|\s+$/, '' ).length ) {
        return false;
    }

    // do search
    if ( opt.type == SEARCH_TYPE_SELECTOR ) {
        // console.log( 'do selector search: ' + text );
        searchResult = doSelectorSearch( text, opt );
    } 
    else {
        // console.log( 'do content search: ' + text );
        searchResult = doContentSearch( text, opt );
    }

    if ( ! searchResult ) {
        $( '#content-search-info' ).animateCss( 'hinge' );
    }
    else {
        currentResultIndex( 0 );
        gotoSearchResult();
    }

    return searchResult;
}




export function enable( options ) {
    mergeOptions( options );

    $( document ).on( 'keydown', onDocumentKeyDown );
    $( document ).on( 'click', onDocumentClick );
}

export function disable() {
    $( document ).off( 'keydown', onDocumentKeyDown );
    $( document ).off( 'click', onDocumentClick );
}

