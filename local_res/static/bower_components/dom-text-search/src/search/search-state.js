import { 
    STATE_NORMAL, STATE_AFTER_SEARCH
    , STATE_SEARCHING, STATE_BEFORE_SEARCH 
} from '../config/constant';

let searchState = STATE_NORMAL;

function setState( state ) {
    let isValidState = [ 
            STATE_NORMAL
            , STATE_BEFORE_SEARCH
            , STATE_SEARCHING
            , STATE_AFTER_SEARCH 
        ].indexOf( state ) >= 0;

    if ( ! isValidState ) {
        throw new Error( 'setState( state ): invalid state' );
    }
    // console.log( 'state: ' + state );
    searchState = state;
}

function getState() {
    return searchState;
}

export {
    setState
    , getState
};

