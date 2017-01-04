#!/bin/bash

TMPFILE=$1.__tmp__
PREVIEWFILE=$1.preview.html
MARKDOWNCMD=/Users/hudamin/projects/git/git-myscripts/markdown/bin/preview/unix/markdown
ROOT=/Users/hudamin/projects/git/git-myscripts/markdown/bin/preview
TPL=tpl

if [ "$2" == "local" ]; then
    TPL=tpl_local
fi

cat "$1" "$ROOT/file_empty_line" > "$TMPFILE"

$MARKDOWNCMD "$TMPFILE" | cat "$ROOT/$TPL/header.tpl.html" - "$ROOT/$TPL/footer.tpl.html" \
    > "$PREVIEWFILE" \
    && open "$PREVIEWFILE"

rm "$TMPFILE"
