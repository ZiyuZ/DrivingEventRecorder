package main

import (
	"fmt"
	"github.com/labstack/echo"
	"net/http"
	"strconv"
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func ping(c echo.Context) error {
	return c.JSON(http.StatusOK, &Response{0, "pong", nil})
}

func getEventDefinition(c echo.Context) error {
	data, err := queryEventDefinitions()
	if err != nil {
		message := fmt.Sprintf("Failed to read events definition: %v.", err)
		E.Logger.Error(message)
		return c.JSON(http.StatusInternalServerError, &Response{1, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Read events definition successfully", data})
}

func getVideoList(c echo.Context) error {
	data, err := GetFileListByPath()
	if err != nil {
		message := fmt.Sprintf("Failed to read video list: %v.", err)
		E.Logger.Error(message)
		return c.JSON(http.StatusInternalServerError, &Response{1, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Read video list successfully", data})
}

func getEvent(c echo.Context) error {
	data, err := queryEvent()
	if err != nil {
		message := fmt.Sprintf("Failed to read event: %v.", err)
		E.Logger.Error(message)
		return c.JSON(http.StatusInternalServerError, &Response{1, message, nil})
	}
	if len(data) == 0 {
		return c.JSON(http.StatusOK, &Response{0, "No events.", []int{}})
	}
	return c.JSON(http.StatusOK, &Response{0, "Get events successfully", data})
}

func postEvent(c echo.Context) error {
	e := new(Event)
	if err := c.Bind(e); err != nil {
		message := fmt.Sprintf("Bad event structure: %v.", err)
		E.Logger.Error(message)
		return c.JSON(http.StatusBadRequest, &Response{2, message, nil})
	}
	if e.StartTimestamp == 0 || e.StopTimestamp == 0 || e.EventID == 0 {
		message := "Bad event structure: Zero value exists. Event type or timestamps should not be null."
		E.Logger.Error(message)
		return c.JSON(http.StatusBadRequest, &Response{2, message, nil})
	}
	if err := insertEvent(e); err != nil {
		message := fmt.Sprintf("Failed to insert event: %v.", err)
		E.Logger.Error(message)
		return c.JSON(http.StatusInternalServerError, &Response{1, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Add event successfully", nil})
}

func deleteEvent(c echo.Context) error {
	id, err := strconv.Atoi(c.QueryParam("id"))
	if err != nil {
		message := fmt.Sprintf("Unknown id (%v): %v.", id, err)
		E.Logger.Error(message)
		return c.JSON(http.StatusBadRequest, &Response{2, message, nil})
	}
	if err := deleteEventById(id); err != nil {
		message := fmt.Sprintf("Failed to delete event (id=%v): %v.", id, err)
		E.Logger.Error(message)
		return c.JSON(http.StatusBadRequest, &Response{2, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Delete event successfully", nil})
}

func getComfortLevel(c echo.Context) error {
	data, err := queryComfortLevel()
	if err != nil {
		message := fmt.Sprintf("Failed to read Passanger Comfort Level: %v", err)
		E.Logger.Error(message)
		return c.JSON(http.StatusInternalServerError, &Response{1, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Get Passanger Comfort Level successfully", data})
}

func postComfortLevel(c echo.Context) error {
	pcl := new(PassengerComfortLevel)
	if err := c.Bind(pcl); err != nil {
		message := fmt.Sprintf("Bad Passanger Comfort Level structure: %v", err)
		E.Logger.Error(message)
		return c.JSON(http.StatusInternalServerError, &Response{2, message, nil})
	}
	if err := insertComfortLevel(pcl); err != nil {
		message := fmt.Sprintf("Failed to insert Passanger Comfort Level: %v", err)
		E.Logger.Error(message)
		return c.JSON(http.StatusInternalServerError, &Response{1, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Add Passenger Comfort Level successfully", nil})
}

func deleteComfortLevel(c echo.Context) error {
	id, err := strconv.Atoi(c.QueryParam("id"))
	if err != nil {
		message := fmt.Sprintf("Unknown id (%v): %v.", id, err)
		E.Logger.Error(message)
		return c.JSON(http.StatusBadRequest, &Response{2, message, nil})
	}
	if err := deleteComfortLevelByID(id); err != nil {
		message := fmt.Sprintf("Failed to delete Passenger Comfort Level (id=%v): %v.", id, err)
		E.Logger.Error(message)
		return c.JSON(http.StatusBadRequest, &Response{2, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Delete Passenger Comfort Level successfully", nil})
}
