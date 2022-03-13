import $ from 'jquery';

export function scrollByLine( options ) {
    var opt = options || {};
    opt.operation = opt.operation || 1;
    opt.lineHeight = opt.lineHeight 
        || parseInt( $( document.body ).css( 'line-height' ) );
    // console.log( 'scrollByLine: ' + opt.lineHeight );
    window.scrollBy( 0, opt.lineHeight * opt.operation );
}

export function scrollByPage( options ) {
    var opt = options || {};
    opt.operation = opt.operation || 1;
    opt.pageHeight = opt.pageHeight 
        || $( window ).height();
    // console.log( 'scrollByPage: ' + opt.pageHeight );
    window.scrollBy( 0, opt.pageHeight * opt.operation );
}

