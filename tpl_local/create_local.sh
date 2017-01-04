#!/bin/bash

files=(
    http://258i.com/docs/markdown_res/bootstrap/css/bootstrap.min.css  
    http://258i.com/docs/markdown_res/bootstrap/css/bootstrap-theme.min.css 
    http://258i.com/docs/markdown_res/css/github-markdown.css 
    http://258i.com/docs/markdown_res/js/jquery-1.9.1.min.js
    http://258i.com/docs/markdown_res/bootstrap/js/bootstrap.min.js
    http://258i.com/docs/markdown_res/js/scrollspy.js
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
    | sed -e '/^\/\* --replace github-markdown.css/r assets/github-markdown.css' \
    | sed -e '/^\/\* --replace jquery-1.9.1.min.js/r assets/jquery-1.9.1.min.js' \
    > header.tpl.html \
    2>/dev/null

cat tpl-footer.tpl.html \
    | sed -e '/^\/\* --replace.*/G' \
    | sed -e '/^\/\* --replace bootstrap.min.js/r assets/bootstrap.min.js' \
    | sed -e '/^\/\* --replace scrollspy.js/r assets/scrollspy.js' \
    > footer.tpl.html \
    2>/dev/null

