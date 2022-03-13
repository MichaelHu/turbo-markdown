#!/bin/bash

files=(
    http://123.56.89.145/docs/markdown_res/bootstrap/css/bootstrap.min.css  
    http://123.56.89.145/docs/markdown_res/bootstrap/css/bootstrap-theme.min.css 
    http://123.56.89.145/static/bower_components/bootstrap-table/dist/bootstrap-table.min.css
    http://123.56.89.145/docs/markdown_res/css/github-markdown.css 
    http://123.56.89.145/static/bower_components/snippets/css/mp/style.css
    http://123.56.89.145/static/bower_components/jquery/dist/jquery.min.js
    http://123.56.89.145/static/build/babel/babel.min.js
    http://123.56.89.145/static/bower_components/snippets/js/mp/fly.js
    http://123.56.89.145/docs/markdown_res/bootstrap/js/bootstrap.min.js
    http://123.56.89.145/static/bower_components/bootstrap-table/dist/bootstrap-table.min.js
    http://123.56.89.145/docs/markdown_res/js/scrollspy.js
    http://123.56.89.145/docs/markdown_res/js/lazyload.min.js
    http://123.56.89.145/docs/markdown_res/js/augment.js
    http://123.56.89.145/static/bower_components/dom-text-search/build/dts_full.js
    http://123.56.89.145/static/build/clipboard.js/clipboard.min.js
)

pushd ./assets
for i in ${files[*]}; do 
    echo "getting $i"
    curl -O $i
    # filename=`echo $i | sed -e 's/^.*\/\([^\/]*\)$/\1/g'` 
    # echo | cat $filename - > $filename.tmp
    # mv $filename.tmp $filename
done
popd

cat tpl-header.tpl.html \
    | sed -e '/^\/\* --replace.*/G' \
    | sed -e '/^\/\* --replace bootstrap.min.css/r assets/bootstrap.min.css' \
    | sed -e '/^\/\* --replace bootstrap-theme.min.css/r assets/bootstrap-theme.min.css' \
    | sed -e '/^\/\* --replace bootstrap-table.min.css/r assets/bootstrap-table.min.css' \
    | sed -e '/^\/\* --replace github-markdown.css/r assets/github-markdown.css' \
    | sed -e '/^\/\* --replace style.css/r assets/style.css' \
    | sed -e '/^\/\* --replace jquery.min.js/r assets/jquery.min.js' \
    | sed -e '/^\/\* --replace babel.min.js/r assets/babel.min.js' \
    > header.tpl.html \
    2>/dev/null

cat tpl-footer.tpl.html \
    | sed -e '/^\/\* --replace.*/G' \
    | sed -e '/^\/\* --replace fly.js/r assets/fly.js' \
    | sed -e '/^\/\* --replace bootstrap.min.js/r assets/bootstrap.min.js' \
    | sed -e '/^\/\* --replace bootstrap-table.min.js/r assets/bootstrap-table.min.js' \
    | sed -e '/^\/\* --replace scrollspy.js/r assets/scrollspy.js' \
    | sed -e '/^\/\* --replace lazyload.min.js/r assets/lazyload.min.js' \
    | sed -e '/^\/\* --replace augment.js/r assets/augment.js' \
    | sed -e '/^\/\* --replace dts_full.js/r assets/dts_full.js' \
    | sed -e '/^\/\* --replace clipboard.min.js/r assets/clipboard.min.js' \
    > footer.tpl.html \
    2>/dev/null

