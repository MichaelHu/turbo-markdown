#!/bin/bash
# sh markdown-mac.sh <file> [--local] [--no-preview]

TMPFILE=$1.__tmp__
PREVIEWFILE=$1.html
ROOT=$MARKDOWN_TURBO_ROOT
MARKDOWNCMD=$MARKDOWN_TURBO_CMD
TPL=tpl
ISPREVIEW=1

if [ "$2" == "--local" -o "$3" == "--local" ]; then
    TPL=tpl_local
fi

if [ "$2" == "--no-preview" -o "$3" == "--no-preview" ]; then
    ISPREVIEW=0
fi

cat "$1" "$ROOT/file_empty_line" > "$TMPFILE"

$MARKDOWNCMD "$TMPFILE" | cat "$ROOT/$TPL/header.tpl.html" - "$ROOT/$TPL/footer.tpl.html" \
    > "$PREVIEWFILE" \
    && (( $ISPREVIEW )) && open "$PREVIEWFILE"

rm "$TMPFILE"
