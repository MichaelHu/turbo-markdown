import $ from 'jquery';
import styles from 'animate.css/animate.min.css';

$.fn.extend( {
    animateCss: function ( animationName, onFinish ) {
        var animationEnd = [
                'webkitAnimationEnd'
                , 'mozAnimationEnd'
                , 'MSAnimationEnd'
                , 'oanimationend'
                , 'animationend'
            ].join( ' ' );
        this.addClass( styles.animated + ' ' + styles[ animationName ] )
            .one( animationEnd, function() {
                $( this ).removeClass( styles.animated + ' ' + styles[ animationName ] );
                'function' == typeof onFinish  && onFinish.apply( this );
            });
        return this;
    }
} );

