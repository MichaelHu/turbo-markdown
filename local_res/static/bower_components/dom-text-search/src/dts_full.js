import { enable as enableSearch } from './search';
import { enable as enableVimLike } from './plugins/vim-like';
import './plugins/animate';

enableSearch( 
    { 
        highlightExcludes: [ '#navbar-auto' ]
        , hideExcludes: [ '#navbar-auto' ] 
    } 
);
enableVimLike();
