@echo off
REM 🔍 Monitoring Script untuk Mubinyx di Hostinger (Windows Version)

echo === MUBINYX MONITORING SCRIPT ===
echo Timestamp: %date% %time%
echo.

REM Check if website is accessible
echo 🌐 Checking website accessibility...
curl -s -o nul -w "%%{http_code}" https://yourdomain.com > temp_status.txt
set /p status=<temp_status.txt
if "%status%"=="200" (
    echo ✅ Website is accessible
) else (
    echo ❌ Website is not accessible (Status: %status%)
)
del temp_status.txt
echo.

REM Check API endpoint
echo 🔗 Checking API endpoint...
curl -s -o nul -w "%%{http_code}" https://yourdomain.com/api > temp_api_status.txt
set /p api_status=<temp_api_status.txt
if "%api_status%"=="200" (
    echo ✅ API endpoint is responding
) else if "%api_status%"=="404" (
    echo ✅ API endpoint is responding (404 expected if no default route)
) else (
    echo ❌ API endpoint is not responding (Status: %api_status%)
)
del temp_api_status.txt
echo.

REM Performance check
echo ⚡ Performance check...
curl -s -o nul -w "Time: %%{time_total}s, Size: %%{size_download} bytes" https://yourdomain.com
echo.
echo.

REM SSL Certificate check
echo 🔒 SSL Certificate check...
curl -s -I https://yourdomain.com | findstr "HTTP" > temp_ssl.txt
set /p ssl_status=<temp_ssl.txt
echo %ssl_status%
del temp_ssl.txt
echo.

REM DNS check
echo 🌍 DNS Resolution check...
nslookup yourdomain.com
echo.

echo === MONITORING COMPLETE ===
echo.
echo 📝 Tips:
echo - Replace 'yourdomain.com' with your actual domain
echo - Run this script regularly to monitor your site
echo - Consider setting up automated monitoring
echo.
pause
