@echo off

:: شغل الباك إند
start cmd /k "cd /d E:\Lan_Production\TFourthGitHub\ProjectsCost\projectscosback && npm run dev"

:: شغل الفرونت إند
start cmd /k "cd /d E:\Lan_Production\TFourthGitHub\ProjectsCost\projectscostfront && npm run dev"

:: انتظر 3 ثواني عشان تتأكد السيرفر بدأ (اختياري)
timeout /t 3 >nul

:: افتح المتصفح على رابط الفرونت
start "" "http://localhost:5173"
