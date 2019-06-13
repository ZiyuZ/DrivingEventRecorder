@ECHO OFF
echo Start building program...
IF EXIST build (rd build /S /Q)
mkdir build
mkdir build\public
echo Copy configuration...
xcopy config.toml build /Q
xcopy definition.json build /Q
echo Build Windows program...
SET GOOS=windows
SET GOARCH=amd64
go build -o build\recorder.exe
echo Build Linux program...
SET CGO_ENABLED=0
SET GOOS=linux
SET GOARCH=amd64
go build -o build\recorder
echo done.