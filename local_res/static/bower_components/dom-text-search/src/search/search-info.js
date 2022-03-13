import $ from 'jquery';
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

export function update( options ) {
    let opt = options || {};
    let $body = $( document.body );
    let $searchInfo = $( '#content-search-info' );

    if ( ! $searchInfo.length ) {
        $searchInfo = $( 
            '<div id="content-search-info" class="' + infoStyle + '">'
            + '<span class="' + infoCurrentStyle + '">18</span>' 
            + '<span class="' + infoSplitterStyle + '">/</span>' 
            + '<span class="' + infoTotalStyle + '">100</span>' 
            + '</div>'
        );
        $body.append( $searchInfo );
    }

    $searchInfo.show();
    let $current = $searchInfo.find( '.' + infoCurrentStyle );
    let $total = $searchInfo.find( '.' + infoTotalStyle );

    $current.text( opt.current || 0 );
    $total.text( opt.total || 0 );
}

export function close() {
    $( '#content-search-info' ).hide();
}

