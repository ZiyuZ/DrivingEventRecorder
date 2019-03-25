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

func getRating(c echo.Context) error {
	data, err := queryRating()
	if err != nil {
		message := fmt.Sprintf("Failed to read Ratings: %v", err)
		E.Logger.Error(message)
		return c.JSON(http.StatusInternalServerError, &Response{1, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Get Ratings successfully", data})
}

func postRating(c echo.Context) error {
	rating := new(Rating)
	if err := c.Bind(rating); err != nil {
		message := fmt.Sprintf("Bad Rating structure: %v", err)
		E.Logger.Error(message)
		return c.JSON(http.StatusInternalServerError, &Response{2, message, nil})
	}
	if err := insertRating(rating); err != nil {
		message := fmt.Sprintf("Failed to insert Rating: %v", err)
		E.Logger.Error(message)
		return c.JSON(http.StatusInternalServerError, &Response{1, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Add Rating successfully", nil})
}

func deleteRating(c echo.Context) error {
	id, err := strconv.Atoi(c.QueryParam("id"))
	if err != nil {
		message := fmt.Sprintf("Unknown id (%v): %v.", id, err)
		E.Logger.Error(message)
		return c.JSON(http.StatusBadRequest, &Response{2, message, nil})
	}
	if err := deleteRatingByID(id); err != nil {
		message := fmt.Sprintf("Failed to delete Rating (id=%v): %v.", id, err)
		E.Logger.Error(message)
		return c.JSON(http.StatusBadRequest, &Response{2, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Delete Rating successfully", nil})
}
