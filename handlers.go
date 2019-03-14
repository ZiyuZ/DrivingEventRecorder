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
		message := fmt.Sprintf("Failed to read event definition: %v.", err)
		E.Logger.Warn(message)
		return c.JSON(http.StatusInternalServerError, &Response{1, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Read events definition successfully", data})
}

func getEvent(c echo.Context) error {
	data, err := queryEvent()
	if err != nil {
		message := fmt.Sprintf("Failed to read event: %v.", err)
		E.Logger.Warn(message)
		return c.JSON(http.StatusInternalServerError, &Response{1, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Get events successfully", data})
}

func postEvent(c echo.Context) error {
	e := new(Event)
	if err := c.Bind(e); err != nil {
		message := fmt.Sprintf("Bad event structure: %v.", err)
		E.Logger.Warn(message)
		return c.JSON(http.StatusBadRequest, &Response{2, message, nil})
	}
	if err := insertEvent(e); err != nil {
		message := fmt.Sprintf("Failed to insert event: %v.", err)
		E.Logger.Warn(message)
		return c.JSON(http.StatusInternalServerError, &Response{1, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Add events successfully", nil})
}

func deleteEvent(c echo.Context) error {
	id, err := strconv.Atoi(c.QueryParam("delete_event_id"))
	if err != nil {
		message := fmt.Sprintf("Unknown id (%v): %v.", id, err)
		E.Logger.Warn(message)
		return c.JSON(http.StatusBadRequest, &Response{2, message, nil})
	}
	if err := deleteEventById(id); err != nil {
		message := fmt.Sprintf("Failed to delete event (id=%v): %v.", id, err)
		E.Logger.Warn(message)
		return c.JSON(http.StatusBadRequest, &Response{2, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Delete events successfully", nil})
}
