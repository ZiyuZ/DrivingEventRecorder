@ECHO OFF
echo Start building program...
IF EXIST build (rd build /S /Q)
mkdir build
mkdir build\public
echo Copy configuration...
xcopy config.toml build /Q
xcopy definition.json build /Q
echo Build program (Windows)...
go build -o build\recorder.exe
echo done.