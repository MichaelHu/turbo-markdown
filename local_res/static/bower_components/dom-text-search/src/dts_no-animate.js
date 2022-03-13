import { enable as enableSearch } from './search';
import { enable as enableVimLike } from './plugins/vim-like';
import './plugins/no-animate';

enableSearch( { hideExcludes: [ '#navbar-auto' ] } );
enableVimLike();
