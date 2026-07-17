@echo off
REM ============================================================
REM  Bano Qabil Convocation - Kiosk launcher (Windows)
REM  Silent thermal printing to BIXOLON SRP-350III.
REM
REM  BEFORE THE EVENT:
REM   1. Install BIXOLON SRP-350III Windows driver.
REM   2. Windows Settings > Printers: set SRP-350III as DEFAULT.
REM      (--kiosk-printing always uses the Windows default printer.)
REM   3. Set paper width to 80mm in the driver preferences.
REM   4. Adjust CHROME path below if Chrome is installed elsewhere.
REM ============================================================

set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "URL=https://convocation.banoqabil.pk"
set "PROFILE=%LOCALAPPDATA%\bq-kiosk-profile"

if not exist "%CHROME%" set "CHROME=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

REM Kill any running Chrome so the kiosk flags are not ignored.
REM (A new chrome.exe attaches to an existing instance and drops the flags.)
taskkill /F /IM chrome.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

REM Do NOT add --disable-print-preview: it disables the pipeline that
REM --kiosk-printing uses to auto-confirm, which brings back the OS dialog.
start "" "%CHROME%" ^
  --kiosk ^
  --kiosk-printing ^
  --no-first-run ^
  --disable-infobars ^
  --disable-features=Translate ^
  --user-data-dir="%PROFILE%" ^
  "%URL%"
