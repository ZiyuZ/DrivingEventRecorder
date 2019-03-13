package main

import (
	"fmt"
	"github.com/jmoiron/sqlx"
)

type (
	// Recorded event struct in driving behavior experiment
	Event struct {
		EventType   int    `json:"event_type"`
		EventCode   string `json:"event_code"`
		StartTime   string `json:"start_time"`
		StopTime    string `json:"stop_time"`
		Description string `json:"description"`
	}

	// Definition struct of events
	EventType struct {
		EventID     int    `json:"event_id"`
		Description string `json:"description"`
	}

	EventOption struct {
		GroupID     int    `json:"group_id"`
		OptionID    int    `json:"option_id"`
		GroupType   string `json:"group_type"`
		Description string `json:"description"`
	}

	EventDefinition struct {
		EventType
		EventOptions []EventOption
	}
)

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
