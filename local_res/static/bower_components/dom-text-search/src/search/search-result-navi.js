import $ from 'jquery';
import { update as updateSearchInfo } from './search-info'; 
import { searchHighlightStyle, searchElementHighlightStyle } from '../style';

let _currentResultIndex = 0;

export function currentResultIndex ( newIndex ) {
    if ( typeof newIndex == 'number' ) {
        _currentResultIndex = newIndex;
    }
    return _currentResultIndex;
}

export function gotoSearchResult( options ) {
    var opt = options || {};
    var $results = $( '.' + searchHighlightStyle )
        .add( '.' + searchElementHighlightStyle )
        // we only care the visible results
        .filter( function( index ) {
            return $( this ).is( ':visible' );
        } )
        ;
    var len = $results.length;
    var $result;

    opt.operation = opt.operation || 0;

    if ( ! len ) {
        return;
    }

    setTimeout( function() {
        // make sure _currentResultIndex not be a negative number
        _currentResultIndex = ( len + _currentResultIndex + opt.operation ) % len;
        $result = $( $results[ _currentResultIndex ] );

        if ( $result[ 0 ].scrollIntoViewIfNeeded ) {
            // element.scrollIntoView( alignWithTop )
            $result[ 0 ].scrollIntoViewIfNeeded();
        }
        else {
            var pageHeight = $( window ).height();
            var offset = $result.offset();
            window.scrollTo( 0, offset.top - pageHeight / 2 ); 
        }

        updateSearchInfo( { current: _currentResultIndex + 1, total: len } );
        // immediately after search
        if ( ! opt.operation ) {
            $( '#content-search-info' ).animateCss( 'jello' );
        }

        // point out the current searched item
        $result.animateCss( 'flash' );
    }, 0 );
}

