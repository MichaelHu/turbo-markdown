// Just use it everywhere. Don't care where it is. 
window.fly = window.fly 
    || (function(){

    // @require jQuery

    var flowchartOptions = {
        x: 0,
        y: 0,
        "line-width": 2,
        "line-length": 50,
        "text-margin": 10,
        "font-size": 14,
        "font-color": "#000",
        "line-color": "black",
        "element-color": "black",
        fill: "white",
        "yes-text": "yes",
        "no-text": "no",
        "arrow-end": "block",
        scale: 1,

        // style symbol types
        symbols: {
            start: {
                "font-color": "red",
                "element-color": "green",
                fill: "yellow"
            },
            end: {
                class: "end-element"
            }
        },

        // even flowstate support ;-)
        flowstate: {
            past: { fill: "#CCCCCC", "font-size": 12 },
            current: { fill: "yellow", "font-color": "red", "font-weight": "bold" },
            future: { fill: "#FFFF99" },
            request: { fill: "blue" },
            invalid: { fill: "#999" },
            customize: { fill: "green" },
            approved: {
                fill: "#58C4A3",
                "font-size": 12,
                "yes-text": "APPROVED",
                "no-text": "n/a"
            },
            rejected: {
                fill: "#C45879",
                "font-size": 12,
                "yes-text": "n/a",
                "no-text": "REJECTED"
            }
        }
    }; 

    var _cuid = 1;

    function cuid() {
        return _cuid++;
    }

    function random(min, max){
        return min + Math.random() * ( max - min );
    }

    function randomData(min, max, size) {
        var data = [];
        for ( var i=0; i<size; i++ ) {
            data.push(random(min, max));
        }
        return data;
    }

    function randomColor(){

        function pad(v){
            if(v.length < 2) {
                v = '0' + v;
            }
            return v;
        }

        return '#'
            + pad( ( randomData(0, 255, 1)[0] | 0 ).toString(16) )
            + pad( ( randomData(0, 255, 1)[0] | 0 ).toString(16) )
            + pad( ( randomData(0, 255, 1)[0] | 0 ).toString(16) )
            ;
    }

    function _getStr(args, $cont){
        var arr = [], arg, txt;
        if(args.length){
            for(var i=0; i<args.length; i++){
                arg = args[i]; 
                if('function' == typeof arg) arg = arg.toString();
                if('object' == typeof arg) arg = JSON.stringify(
                    arg
                    , null
                    , 4
                );
                arr.push(arg);
            } 
            txt = arr.join(' | ')
                    .replace(/</g, '&lt;')
                    .replace(/\r?\n/g, '<br>')
                    .replace(/\x20/g, '&nbsp;')
                    ;
        }
        else {
            txt = $cont.html()
                .replace(/</g, '&lt;')
                ;
        }
        return txt;
    }

    var Display = {

        show: function($cont, $console){
            return function(){
                txt = _getStr(arguments, $cont);
                $console.html(txt)
            };
        }

        , append_show: function($cont, $console){
            return function(content){
                txt = _getStr(arguments, $cont);
                $console.html(
                    $console.html() 
                    + '<br>'
                    + txt 
                ); 
            };
        }

    };

    function createShow(wrapper) {

        var $wrapper = $(wrapper); 

        var $cont = $wrapper.find('.test-container')
            , $console = $wrapper.find('.test-console');

        var show = Display.show($cont, $console);
        var append_show = Display.append_show($cont, $console);

        return {
            show: show
            , append_show: append_show
        };
    }

    function extend() {
        var args = arguments
            , dest = args[0]
            ;

        if(!dest){
            return;
        }

        for(var i=1; i<args.length; i++){
            var src = args[i];
            for(var j in src){
                if(src.hasOwnProperty(j)){
                    dest[j] = src[j];
                }                
            }
        }

        return dest;
    }




    $(function(){

        $('pre').each(function(index, item){
            var $pre = $(item)
                , str = $pre.data('script')
                ;

            setTimeout(function(){

                try {
                    exec(str);
                    checkEditable(str);
                }
                catch (e) {
                    var msg = 'script error: ' + e.name + ', ' + e.message;
                    console.log(
                        msg
                        , e.stack
                        , $pre.text()
                    );
                    // alert( msg + '\ncode: ' + $pre.text() );
                    $( '<p style="color: #666; font-style: italic; font-family: monospace;">' 
                        + '<em style="color: red; font-weight: bold;">[ parse error ]</em>: '
                        + msg 
                        + '</p>' 
                    ).insertBefore( $pre );
                }

            }, 0);

            function execScript( type ){
                var code = $pre.text();

                if ( 'babel' == type ) {
                    code = Babel.transform( code, { presets: [ 'es2015', 'stage-0', 'react' ] } ).code;

                    if ( type.indexOf( 'babel-loose' ) ) {
                        code = code.replace( /^\s*(['"])use\s+strict\1;?/, '' );
                    }
                }

                $(
                    '<' + 'script>'
                    + code 
                    + '</' + 'script>'
                )
                .insertBefore($pre)
                ;
            }

            function execFlowchart(script) {
                var code = $pre.text();
                var diagram = flowchart.parse(code);
                var $diagramContainer = $('<div />').insertBefore($pre);
                diagram.drawSVG($diagramContainer[0], flowchartOptions);
                if (script.indexOf('show-code') < 0) {
                    $pre.hide();
                }
            }

            function execMermaid(script) {
                var code = $pre.text();
                var containerId = 'mermaid_container_' + cuid();
                var $diagramContainer = $('<div />')
                    .insertBefore($pre)
                    ;

                mermaidAPI.render(
                    containerId 
                    , code 
                    , function(svgCode) {
                        $diagramContainer.html(svgCode);
                    }
                    , $diagramContainer[0]
                );

                if (script.indexOf('show-code') < 0) {
                    $pre.hide();
                }
            }

            function execHTML(){
                var $insertBefore = $pre;
                if($pre.prev('button').length){
                    $insertBefore = $pre.prev('button'); 
                }

                $insertBefore
                    .prev('.mp-exec-html')
                    .remove()
                    ;

                $(
                    '<div class="mp-exec-html">'
                    + $pre.text()
                    + '</div>'
                )
                .insertBefore($insertBefore)
                ;
            }

            function exec(script) {
                // es5
                if(script && script.indexOf('javascript') >= 0){
                    execScript();
                }
                // es6+ / react, no 'use strict';
                else if(script && script.indexOf('babel-loose') >= 0){
                    execScript( 'babel-loose' );
                }
                else if(script && script.indexOf('babel') >= 0){
                    execScript( 'babel' );
                }
                // flowchart
                else if(script && script.indexOf('flowchart') >= 0){
                    execFlowchart(script);
                }
                else if(script && script.indexOf('mermaid') >= 0){
                    execMermaid(script);
                }
                // html / svg 
                else if(script && script.indexOf('html') >= 0){
                    execHTML();
                }
                // other
                else if(script) {
                    if(typeof window.cbScriptBlock == 'function'){
                        /*
                         * @desc 脚本回调函数
                         * @param $pre      {jQuery Object}     pre标签的jQuery对象
                         * @param script    {string}            data-script属性字符串
                         **/
                        window.cbScriptBlock($pre, script);
                    }
                }
            }

            function checkEditable(script){
                if(script && script.indexOf('editable') >= 0){
                    $pre.find('code')
                        .attr('contenteditable', "true")
                        ;

                    $('<button style="margin-bottom:5px;">Restart</button>')
                        .insertBefore($pre)
                        .on('click', function(){
                            exec(script);
                        })
                        ;
                }
            }

        });

    });


    return {
        random: random
        , randomData: randomData
        , randomColor: randomColor
        , createShow: createShow
        , extend: extend
    };


})();
