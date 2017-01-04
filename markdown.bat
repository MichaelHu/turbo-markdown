@echo off
setlocal enabledelayedexpansion

set TMPFILE=%1.__tmp__
set PREVIEWFILE=%1.preview.html
set MARKDOWNCMD=C:\markdown_preview\win\markdown.exe
set ROOT=C:\markdown_preview
set TPL=tpl

if "%2" == "local" set TPL=tpl_local

type %1 "%ROOT%\file_empty_line" > "%TMPFILE%"

%MARKDOWNCMD% "%TMPFILE%" > "%ROOT%\tmp\__tmp__.md.html" 
type "%ROOT%\!TPL!\header.tpl.html" "%ROOT%\tmp\__tmp__.md.html" "%ROOT%\!TPL!\footer.tpl.html" > "%PREVIEWFILE%" 
rem must no double-quotes
start %PREVIEWFILE%

del "%TMPFILE%"

endlocal
@echo on
