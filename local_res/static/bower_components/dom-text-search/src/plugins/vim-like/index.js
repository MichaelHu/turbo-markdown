import $ from 'jquery';
import { scrollByLine, scrollByPage } from './page-scroll';

let lastKeyIsG = false;

function onKeyDown ( e ) {

    let G_KEY = 71, J_KEY = 74, K_KEY = 75
        , U_KEY = 85, D_KEY = 68
        ;
    let keyCode = e.keyCode || e.which;
    let tagName = e.target.tagName || '';

    if ( /input|textarea/i.test( tagName ) ) {
        // G-key state transformation
        lastKeyIsG = false;
        return;
    }

    if ( keyCode == G_KEY ) {
        if ( e.shiftKey ) {
            // go file end
            window.scrollBy( 0, $( document.body ).height() );
        }
        else {
            if ( ! lastKeyIsG ) {
                // G-key state transformation
                lastKeyIsG = true;
                // update state and leave
                return;
            }
            else {
                // go file start
                window.scrollTo( 0, 0 );
            }
        }
    }

    // G-key state transformation
    lastKeyIsG = false;

    if ( keyCode == J_KEY ) {
        scrollByLine();
    }
    else if ( keyCode == K_KEY ) {
        scrollByLine( { operation: -1 } );
    }
    else if ( keyCode == D_KEY && e.ctrlKey ) {
        scrollByPage();
    }
    else if ( keyCode == U_KEY && e.ctrlKey ) {
        scrollByPage( { operation: -1 } );
    }

}

function enable() {
    $( document ).on( 'keydown', onKeyDown );
}

function disable() {
    $( document ).off( 'keydown', onKeyDown );
}

export { enable, disable };
