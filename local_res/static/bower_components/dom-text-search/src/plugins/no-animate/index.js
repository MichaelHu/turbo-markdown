import $ from 'jquery';

if ( typeof $.fn.animateCss != 'function' ) {
    $.fn.animateCss = function() {
        console.info( '$.fn.animateCss(): no animate' );
        return this;
    };
}
