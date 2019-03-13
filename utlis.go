package main

import (
	//"encoding/json"
	"fmt"
	"github.com/olekukonko/tablewriter"
	"gopkg.in/ini.v1"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
)

var confPath = "config.ini"

type config struct {
	Debug       bool `json:"debug"`
	CallBrowser bool `json:"call_browser"`

	DatabasePath string `json:"database_path"`
	PublicPath   string `json:"public_path"`

	ServerPort int    `json:"server_port"`
	Log        bool   `json:"log"`
	LogPath    string `json:"log_path"`
}

//func checkFilePath(in string) string {
//}

func checkDirPath(in string) string {
	pathInfo, err := os.Stat(in)
	if err != nil {
		fmt.Printf("Invalid file: %v\n", err)
		os.Exit(1)
	}
	if !pathInfo.IsDir() {
		fmt.Printf("Invalid directory path: %v\n", in)
		os.Exit(1)
	}
	return in
}

func readConf() *config {
	cfg, err := ini.LoadSources(ini.LoadOptions{
		SkipUnrecognizableLines: true,
	}, confPath)
	if err != nil {
		fmt.Printf("Fail to read config file: %v\n", err)
		os.Exit(1)
	}

	logFlag := cfg.Section("server").Key("log").MustBool(false)
	c := &config{
		Debug:       cfg.Section("dev").Key("debug").MustBool(false),
		CallBrowser: cfg.Section("dev").Key("call_browser").MustBool(true),
		DatabasePath: cfg.Section("resource").Key("database_path").Validate(func(databasePath string) string {

			pathInfo, err := os.Stat(databasePath)
			if os.IsNotExist(err) {
				fmt.Printf("Database file not found. Attempting to create database: %v\n", databasePath)
				executablePath := cfg.Section("database").Key("executable").MustString(
					filepath.Join(".", "db", "sqlite3"))
				sqlPath := cfg.Section("database").Key("init_script").MustString(
					filepath.Join(".", "db", "init_db.sql"))
				err := exec.Command("cmd", "/c", executablePath, databasePath, "<", sqlPath).Start()
				if err == nil {
					return databasePath
				} else {
					fmt.Printf("Failed to create database: %v\n", err)
					os.Exit(1)
				}
			} else if err != nil {
				fmt.Printf("Invalid file: %v\n", err)
			} else if pathInfo.IsDir() {
				fmt.Printf("Database path points to a directory: %v\n", databasePath)
				os.Exit(1)
			}
			return databasePath
		}),
		PublicPath: cfg.Section("resource").Key("public_path").Validate(checkDirPath),
		ServerPort: cfg.Section("server").Key("port").MustInt(5000),
		Log:        logFlag,
		LogPath: cfg.Section("server").Key("log_path").Validate(func(in string) string {
			if !logFlag {
				return ""
			}
			f, err := os.OpenFile(in, os.O_CREATE, 0666)
			if err != nil {
				fmt.Printf("Fail to create log file: %v\n", in)
				os.Exit(1)
			}
			_ = f.Close()
			return in
		}),
	}
	fmt.Println("Configurations read successfully.")
	data := [][]string{
		{"Debug", strconv.FormatBool(c.Debug)},
		{"CallBrowser", strconv.FormatBool(c.CallBrowser)},
		{"DatabasePath", c.DatabasePath},
		{"PublicPath", c.PublicPath},
		{"ServerPort", strconv.Itoa(c.ServerPort)},
		{"Log", strconv.FormatBool(c.Log)},
		{"LogPath", c.LogPath},
	}
	table := tablewriter.NewWriter(os.Stdout)
	table.SetHeader([]string{"Config Name", "Value"})
	table.SetHeaderColor(tablewriter.Colors{tablewriter.Bold},
		tablewriter.Colors{tablewriter.Bold})
	table.SetColumnColor(tablewriter.Colors{tablewriter.Bold, tablewriter.FgHiBlackColor},
		tablewriter.Colors{tablewriter.Bold, tablewriter.FgHiRedColor})
	for _, v := range data {
		table.Append(v)
	}
	table.Render()
	return c
}

func callBrowser(ifCallBrowser bool) {
	if ifCallBrowser {
		err := exec.Command("cmd", "/c start http://localhost:5000").Start()
		if err != nil {
			return
		}
	}
	fmt.Printf("Please open \"http://localhost:%v\" in your browser.\n", C.ServerPort)
}
