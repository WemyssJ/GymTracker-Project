@echo off
setlocal

rem GymTracker - build a debug APK for testing on Android.
rem The web app in index.html / images/ stays untouched and keeps working
rem on iOS/desktop as before - this just bundles a copy into an Android app.

cd /d "%~dp0"

echo === Syncing web assets into www/ ===
if not exist www mkdir www
copy /y index.html www\index.html >nul
powershell -NoProfile -Command "Copy-Item -Path 'images' -Destination 'www\images' -Recurse -Force"
if errorlevel 1 goto :error
powershell -NoProfile -Command "Copy-Item -Path 'vendor' -Destination 'www\vendor' -Recurse -Force"
if errorlevel 1 goto :error

echo === Syncing Capacitor android project ===
call npx cap sync android
if errorlevel 1 goto :error

echo === Building debug APK ===
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot"
pushd "%~dp0android"
call .\gradlew.bat assembleDebug
if errorlevel 1 (
    popd
    goto :error
)
popd

set APK=android\app\build\outputs\apk\debug\app-debug.apk
set ADB="C:\Program Files (x86)\Android\android-sdk\platform-tools\adb.exe"
echo.
echo === Build succeeded ===
echo APK: %APK%
echo.
echo To install on a phone connected via USB (with USB debugging enabled):
echo   %ADB% install -r "%APK%"
echo.

%ADB% get-state >nul 2>&1
if not errorlevel 1 (
    echo A device is connected - installing now...
    %ADB% install -r "%APK%"
)
goto :eof

:error
cd /d "%~dp0"
echo.
echo === Build FAILED - see output above ===
exit /b 1
