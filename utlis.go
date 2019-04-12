package main

import (
	//"encoding/json"
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/olekukonko/tablewriter"
	"gopkg.in/ini.v1"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

var confPath = "config.ini"

type config struct {
	Debug       bool `json:"debug"`
	CallBrowser bool `json:"call_browser"`

	DatabasePath string `json:"database_path"`
	PublicPath   string `json:"public_path"`
	VideoPath    string `json:"video_path"`

	ServerPort int    `json:"server_port"`
	Log        bool   `json:"log"`
	LogPath    string `json:"log_path"`
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
					time.Sleep(3 * time.Second)
					fmt.Println("Initialized database successfully.")
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
		VideoPath:  cfg.Section("resource").Key("video_path").Validate(checkDirPath),
		ServerPort: cfg.Section("server").Key("port").MustInt(5000),
		Log:        logFlag,
		LogPath: cfg.Section("server").Key("log_path").Validate(func(in string) string {
			if !logFlag {
				return "unavailable"
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
		{"VideoPath", c.VideoPath},
		{"ServerPort", strconv.Itoa(c.ServerPort)},
		{"Log", strconv.FormatBool(c.Log)},
		{"LogPath", c.LogPath},
	}
	table := tablewriter.NewWriter(os.Stdout)
	table.SetHeader([]string{"Option", "Value"})
	//table.SetHeaderColor(tablewriter.Colors{tablewriter.Bold},
	//	tablewriter.Colors{tablewriter.Bold})
	//table.SetColumnColor(tablewriter.Colors{tablewriter.Bold, tablewriter.FgHiBlackColor},
	//	tablewriter.Colors{tablewriter.Bold, tablewriter.FgHiRedColor})
	for _, v := range data {
		table.Append(v)
	}
	table.Render()
	return c
}

func connectDB() *sqlx.DB {
	db, err := sqlx.Open("sqlite3", C.DatabasePath)
	if err != nil {
		E.Logger.Fatal(err)
	}
	if err := db.Ping(); err != nil {
		E.Logger.Fatal(err)
	}
	fmt.Println("Database connected.")
	return db
}

func callBrowser(ifCallBrowser bool) {
	fmt.Printf("\nPlease visit \"http://localhost:%v\" in your browser on the local computer.\n", C.ServerPort)
	fmt.Printf("Or through an intranet address for other devices in the LAN:\n" +
		"\t1. Run \"ipconfig /all\" in your terminal and view IP addresses.\n" +
		"\t2. Find the local address of the intranet where the target device is located.\n" +
		"\t3. Visit \"http://[IP]:5000\" on the target device.\n")
	ifaces, _ := net.Interfaces()
	for _, i := range ifaces {
		addrs, _ := i.Addrs()
		// handle err
		for _, addr := range addrs {
			ipnet, _ := addr.(*net.IPNet)
			if ipnet.IP.IsGlobalUnicast() {
				fmt.Printf("\t(Maybe you can try: \"http://%v:5000\")\n\n", ipnet.IP.To4())
			}
		}
	}

	if ifCallBrowser {
		cmd := fmt.Sprintf("/c start http://localhost:%v", C.ServerPort)
		err := exec.Command("cmd", cmd).Start()
		if err != nil {
			return
		}
	}
}

func GetFileListByPath() (fileList []string, err error) {
	dirPath := C.VideoPath
	err = filepath.Walk(dirPath, func(path string, f os.FileInfo, err error) error {
		if f != nil && !f.IsDir() && strings.Contains(path, ".mp4") {
			_, file := filepath.Split(path)
			fileList = append(fileList, file)
		}
		return nil
	})
	if err != nil {
		E.Logger.Error("fail")
		return nil, err
	}
	return
}
