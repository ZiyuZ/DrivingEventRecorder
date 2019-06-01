package main

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"strconv"
)

var (
	C  *config
	D  []definition
	E  *gin.Engine
	F  *Folder
	DB *gorm.DB

	_VERSION_ = "2.0.beta"
)

func init() {
	C = readConf()
	D = loadDefinition()
	DB = connectDB()
	E = initEngine()
	F = InitDataStorageFiles() // must after database connected
}

func main() {
	callUserInterface(C.CallBrowser)
	panic(E.Run(":" + strconv.Itoa(C.Port)))
}
