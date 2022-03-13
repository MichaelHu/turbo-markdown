import { REGEXP_PREFIX, SELECTOR_PREFIX } from './constant';
import { escapeRegExp } from '../utils';

export const regSelectorPrefix 
    = new RegExp( '^' + escapeRegExp( SELECTOR_PREFIX ) + '(.*)' );

export const regRegExpPrefix 
    = new RegExp( '^' + escapeRegExp( REGEXP_PREFIX ) + '(.*)' );

