package main

import (
	"fmt"
	"gopkg.in/ini.v1"
	"os"
	"os/exec"
)

var confPath = "config.ini"

type Config struct {
	Debug       bool
	CallBrowser bool

	DatabasePath string
	PublicPath   string

	ServerPort int
	Log        bool
	LogPath    string
}

func checkFilePath(in string) string {
	pathInfo, err := os.Stat(in)
	if err != nil {
		fmt.Printf("Invalid file: %v\n", err)
		os.Exit(1)
	}
	if pathInfo.IsDir() {
		fmt.Printf("Invalid file path: %v\n", in)
		os.Exit(1)
	}
	return in
}

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

func ReadConf() *Config {
	cfg, err := ini.LoadSources(ini.LoadOptions{
		SkipUnrecognizableLines: true,
	}, confPath)
	if err != nil {
		fmt.Printf("Fail to read config file: %v\n", err)
		os.Exit(1)
	}

	logFlag := cfg.Section("server").Key("log").MustBool(false)
	c := &Config{
		Debug:        cfg.Section("dev").Key("debug").MustBool(false),
		CallBrowser:  cfg.Section("dev").Key("call_browser").MustBool(true),
		DatabasePath: cfg.Section("resource").Key("database_path").Validate(checkFilePath),
		PublicPath:   cfg.Section("resource").Key("public_path").Validate(checkDirPath),
		ServerPort:   cfg.Section("server").Key("port").MustInt(5000),
		Log:          logFlag,
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

	return c
}

func callBrowser(ifCallBrowser bool) {
	if ifCallBrowser {
		err := exec.Command("cmd", "/c start http://localhost:5000").Start()
		if err != nil {
			return
		}
	}
	fmt.Printf("Please open \"http://localhost:%v\" in your browser.", C.ServerPort)
}
