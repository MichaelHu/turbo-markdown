/**
 * Create navigation list automatically, updated by hudamin
 * @require jQuery
 * @thanks liguang
 */
(function($){

    if(/\/(?:(?:index|preview)\.md\.html)?([?#].*)?$/.test(location.href)){
        return;
    }

    if( $().scrollspy ){

        var selector = window.scroll_selector || "h2"
            , pre = "nav_";
            
        var list = $(selector)
                .add("h3")
                .add("h4")
                .add("h5")
                .add("h6")
            , $li = null
            , $ul = $('<ul class="nav"></ul>')
            , levelIndices = [0, 0, 0, 0, 0]
            ;

        function normalizeItem(item){
            var $item = $(item)
                , tag = $item[0].tagName
                , txt = $item.text()
                , tmpArr
                ;
            
            switch(tag){

                case 'H2':
                    levelIndices[0]++;
                    if(!/^\s*[一二三四五六七八九十]+、/.test(txt)){
                        $item.text(toCHNNumber(levelIndices[0]) + '、' + $item.text());
                    }
                    levelIndices[1] = 0;
                    levelIndices[2] = 0;
                    levelIndices[3] = 0;
                    levelIndices[4] = 0;
                    break;
                case 'H3':
                    if(!/^\s*[1-9][0-9]*\.[1-9][0-9]*\s+/.test(txt)){
                        levelIndices[1]++;
                        tmpArr = levelIndices.slice( 0, 2 );
                        if ( tmpArr.indexOf( 0 ) < 0 ) {
                            $item.text(
                                tmpArr.join('.') + ' '
                                + $item.text()
                            );
                            levelIndices[2] = 0;
                            levelIndices[3] = 0;
                            levelIndices[4] = 0;
                        }
                        else {
                            levelIndices[1]--;
                        }
                    }
                    break;
                case 'H4':
                    if(!/^\s*(?:[1-9][0-9]*\.){2}[1-9][0-9]*\s+/.test(txt)){
                        levelIndices[2]++;
                        tmpArr = levelIndices.slice( 0, 3 );
                        if ( tmpArr.indexOf( 0 ) < 0 ) {
                            $item.text(
                                tmpArr.join('.') + ' '
                                + $item.text()
                            );
                            levelIndices[3] = 0;
                            levelIndices[4] = 0;
                        }
                        else {
                            levelIndices[2]--;
                        }
                    }
                    break;
                case 'H5':
                    if(!/^\s*(?:[1-9][0-9]*\.){3}[1-9][0-9]*\s+/.test(txt)){
                        levelIndices[3]++;
                        tmpArr = levelIndices.slice( 0, 4 );
                        if ( tmpArr.indexOf( 0 ) < 0 ) {
                            $item.text(
                                tmpArr.join('.') + ' '
                                + $item.text()
                            );
                            levelIndices[4] = 0;
                        }
                        else {
                            levelIndices[3]--;
                        }
                    }
                    break;
                case 'H6':
                    if(!/^\s*(?:[1-9][0-9]*\.){4}[1-9][0-9]*\s+/.test(txt)){
                        levelIndices[4]++;
                        tmpArr = levelIndices.slice( 0 );
                        if ( tmpArr.indexOf( 0 ) < 0 ) {
                            $item.text(
                                tmpArr.join('.') + ' '
                                + $item.text()
                            );
                        }
                        else {
                            levelIndices[4]--;
                        }
                    }
                    break;
            }
        }

        function toCHNNumber(num){
            var ret = ''
                , decade
                , unit
                , decadeArr = [
                    ''
                    , '十'
                    , '二十'
                    , '三十'
                    , '四十'
                    , '五十'
                    , '六十'
                    , '七十'
                    , '八十'
                    , '九十'
                ]
                , unitArr = [
                    ''
                    , '一'
                    , '二'
                    , '三'
                    , '四'
                    , '五'
                    , '六'
                    , '七'
                    , '八'
                    , '九'
                ]
                ;

            if(!num || num >= 100){
                return num;
            }
            decade = Math.floor(num / 10); 
            unit = num % 10; 
            ret += decadeArr[decade] + unitArr[unit]; 

            return ret;
        } 

        list.each(function(i, item){
            normalizeItem(item);
            $li = $("<li></li>");
            $(item).attr("id", pre + i);
            if($(item)[0].tagName == "H3"){
                $li.css({"text-indent":"1em"})
            }
            else if($(item)[0].tagName == "H4"){
                $li.css({"text-indent":"2em"})
            }
            else if($(item)[0].tagName == "H5"){
                $li.css({"text-indent":"3em"})
            }
            else if($(item)[0].tagName == "H6"){
                $li.css({"text-indent":"4em"})
            }
            
            $li.append(
                '<a href="#' + pre + i 
                + '" data-rel-id="' + ( pre + i ) + '">'
                + $(item).text() + "</a>"
            );
            $ul.append($li);
        });
        
        var $navbar = $("<div></div>").attr("id", "navbar-auto")
            .append($ul)
            .append(
                [
                '<div class="navi">'
                , '<div class="arrow up"></div>'
                , '<div class="arrow down"></div>'
                , '</div>'         
                ].join('')
            )
            .on('click', function(e){
                var $target = $(e.target),
                    $link;
                if($target.closest('a').length){
                    e.preventDefault();
                    $link = $target.closest('a'); 
                    if($link[0].protocol == 'file:'){
                        $('#' + $link.data('rel-id'))[0].scrollIntoView();
                        return;
                    }
                    location.replace($link.attr('href'));
                }
            });
        

        var activeScrolling = 0
            , deltaY = 0
            , timer
            ;

        $navbar.find('.arrow')
            .on('mouseover', function(e){
                if(activeScrolling){
                    return;
                }

                activeScrolling = 1;
                $(this).addClass('active');
                if($(this).hasClass('up')){
                    deltaY = -100;
                } 
                else {
                    deltaY = 100;
                }
                scrolling();
            })
            .on('click', function(e){
                var cont = $navbar[0];

                activeScrolling = 0;
                deltaY = 0;
                e.preventDefault();
                e.stopPropagation();

                if(timer) {
                    clearTimeout( timer );
                }

                if($(this).hasClass('up')){
                    cont.scrollTop = 0;
                } 
                else {
                    cont.scrollTop = cont.scrollHeight - cont.offsetHeight;
                }
            })
            .on('mouseout', function(e){
                $(this).removeClass('active');
                activeScrolling = 0;
                deltaY = 0;
                if(timer){
                    clearTimeout( timer );
                }
            })
            ;

        function scrolling() {
            _scrolling();
        } 

        function _scrolling() {
            $navbar[ 0 ].scrollTop += deltaY; 
            if( activeScrolling ) {
                timer = setTimeout( _scrolling, 200 );
            }
        }
        $('body')
            .prepend($navbar)
            .scrollspy({ target: '#navbar-auto' })
            .on('activate.bs.scrollspy', function (dd) {
                var $target = $(dd.target).closest('li'),
                    $cont = $target.closest('#navbar-auto'),
                    offsetTop = $target[0].offsetTop,
                    scrollTop = $cont[0].scrollTop,
                    contHeight = $cont[0].offsetHeight,
                    scrollHeight = $cont[0].scrollHeight;

                // console.log(offsetTop, scrollTop, contHeight, scrollHeight);
                if (offsetTop - scrollTop < 50) {
                    $cont[0].scrollTop = offsetTop - 50;
                }
                else if (offsetTop - contHeight - scrollTop > -80) {
                    $cont[0].scrollTop = offsetTop - contHeight + 80;
                }  
            });
    }

    
})(jQuery);

