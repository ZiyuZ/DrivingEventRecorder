package main

import (
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo"
	_ "github.com/mattn/go-sqlite3"
	"strconv"
)

var (
	E  *echo.Echo
	DB *sqlx.DB
	C  *Config
)

func init() {
	C = ReadConf()
	E = initEcho()
	DB = initDB()
}

func main() {
	callBrowser(C.CallBrowser)
	if C.Debug {
		E.Logger.Debug(E.Start(":" + strconv.Itoa(C.ServerPort)))
	} else {
		E.Logger.Error(E.Start(":" + strconv.Itoa(C.ServerPort)))
	}
}
