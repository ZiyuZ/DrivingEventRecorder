package main

import (
	"errors"
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

func errorReport(c echo.Context, err error, httpErrorCode int, returnCode int, messageFormat string) error {
	message := fmt.Sprintf(messageFormat, err)
	E.Logger.Error(message)
	return c.JSON(httpErrorCode, &Response{returnCode, message, nil})
}

func getEventDefinition(c echo.Context) error {
	data, err := queryEventDefinitions()
	if err != nil {
		return errorReport(c, err, http.StatusInternalServerError, 1, "Failed to read events definition: %v.")
	}
	return c.JSON(http.StatusOK, &Response{0, "Read events definition successfully", data})
}

func getVideoList(c echo.Context) error {
	data, err := GetFileListByPath()
	if err != nil {
		return errorReport(c, err, http.StatusInternalServerError, 1, "Failed to read video list: %v.")
	}
	return c.JSON(http.StatusOK, &Response{0, "Read video list successfully", data})
}

func getEvent(c echo.Context) error {
	data, err := queryEvent()
	if err != nil {
		return errorReport(c, err, http.StatusInternalServerError, 1, "Failed to read event: %v.")
	}
	if len(data) == 0 {
		return c.JSON(http.StatusOK, &Response{0, "No events.", []int{}})
	}
	return c.JSON(http.StatusOK, &Response{0, "Get events successfully", data})
}

func postEvent(c echo.Context) error {
	e := new(Event)
	if err := c.Bind(e); err != nil {
		return errorReport(c, err, http.StatusBadRequest, 2, "Bad event structure: %v.")
	}
	if e.StartTimestamp == 0 || e.StopTimestamp == 0 || e.EventID == 0 {
		return errorReport(c, errors.New("event type or timestamps should not be null"),
			http.StatusBadRequest, 2, "Bad event structure: %v")
	}
	if err := insertEvent(e); err != nil {
		return errorReport(c, err, http.StatusInternalServerError, 1, "Failed to insert event: %v.")
	}
	return c.JSON(http.StatusOK, &Response{0, "Add event successfully", nil})
}

func deleteEvent(c echo.Context) error {
	id, err := strconv.Atoi(c.QueryParam("id"))
	if err != nil {
		return errorReport(c, err, http.StatusBadRequest, 2, "Unknown id format: %v.")
	}
	if err := deleteEventById(id); err != nil {
		return errorReport(c, err, http.StatusBadRequest, 2, "Failed to delete event: %v.")
	}
	return c.JSON(http.StatusOK, &Response{0, "Delete event successfully", nil})
}

func getRating(c echo.Context) error {
	data, err := queryRating()
	if err != nil {
		return errorReport(c, err, http.StatusInternalServerError, 1, "Failed to read Ratings: %v")
	}
	return c.JSON(http.StatusOK, &Response{0, "Get Ratings successfully", data})
}

func postRating(c echo.Context) error {
	rating := new(Rating)
	if err := c.Bind(rating); err != nil {
		return errorReport(c, err, http.StatusBadRequest, 2, "Bad Rating structure: %v")
	}
	if err := insertRating(rating); err != nil {
		return errorReport(c, err, http.StatusInternalServerError, 1, "Failed to insert Rating: %v")
	}
	return c.JSON(http.StatusOK, &Response{0, "Add Rating successfully", nil})
}

func deleteRating(c echo.Context) error {
	id, err := strconv.Atoi(c.QueryParam("id"))
	if err != nil {
		return errorReport(c, err, http.StatusBadRequest, 2, "Unknown id format: %v.")
	}
	if err := deleteRatingByID(id); err != nil {
		return errorReport(c, err, http.StatusBadRequest, 2, "Failed to delete rating: %v.")
	}
	return c.JSON(http.StatusOK, &Response{0, "Delete Rating successfully", nil})
}
