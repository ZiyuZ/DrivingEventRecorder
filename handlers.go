package main

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func ping(c *gin.Context) {
	c.JSON(http.StatusOK, &Response{0, "pong", nil})
}

func errorReport(c *gin.Context, err error, httpErrorCode int, returnCode int, messageFormat string) {
	message := fmt.Sprintf(messageFormat, err)
	writeLog("ERROR", message)
	c.JSON(httpErrorCode, &Response{returnCode, message, nil})
}

func getEventDefinition(c *gin.Context) {
	c.JSON(http.StatusOK, &Response{0, "Read events definition successfully", D})
}

func getVideoList(c *gin.Context) {
	data, err := queryVideos()
	if err != nil {
		errorReport(c, err, http.StatusInternalServerError, 1, "Failed to read video list: %v.")
	}
	var message string
	if len(data) == 0 {
		message = "No videos."
	} else {
		message = "Read video list successfully"
	}
	c.JSON(http.StatusOK, &Response{0, message, data})
}

func getTrajectoryList(c *gin.Context) {
	data, err := queryTrajectories()
	if err != nil {
		errorReport(c, err, http.StatusInternalServerError, 1, "Failed to read video list: %v.")
	}
	var message string
	if len(data) == 0 {
		message = "No trajectories."
	} else {
		message = "Read trajectories list successfully"
	}
	c.JSON(http.StatusOK, &Response{0, message, data})
}

func getDataStorageFiles(c *gin.Context) {
	c.JSON(http.StatusOK, &Response{0, "Read data storage files successfully", F})
}

func getEvent(c *gin.Context) {
	data, err := queryEvents()
	if err != nil {
		errorReport(c, err, http.StatusInternalServerError, 1, "Failed to read event: %v.")
	}
	var message string
	if len(data) == 0 {
		message = "No events."
	} else {
		message = "Get events successfully"
	}
	c.JSON(http.StatusOK, &Response{0, message, data})
}

func postEvent(c *gin.Context) {
	var e Event
	if err := c.Bind(&e); err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Bad event structure: %v.")
	}
	if e.StartTime.IsZero() || e.EventID == 0 {
		errorReport(c, errors.New("event type or timestamps should not be null"),
			http.StatusBadRequest, 2, "Bad event structure: %v")
	}
	if err := insertEvent(&e); err != nil {
		errorReport(c, err, http.StatusInternalServerError, 1, "Failed to insert event: %v.")
	} else {
		c.JSON(http.StatusOK, &Response{0, "Add event successfully", nil})
	}

}

func deleteEvent(c *gin.Context) {
	id, err := strconv.Atoi(c.Query("id"))
	if err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Unknown id format: %v.")
	}
	if err := deleteEventById(id); err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Failed to delete event: %v.")
	} else {
		c.JSON(http.StatusOK, &Response{0, "Delete event successfully", nil})
	}
}

func getRating(c *gin.Context) {
	data, err := queryRatings()
	if err != nil {
		errorReport(c, err, http.StatusInternalServerError, 1, "Failed to read Ratings: %v")
	}
	var message string
	if len(data) == 0 {
		message = "No ratings."
	} else {
		message = "Read ratings list successfully"
	}
	c.JSON(http.StatusOK, &Response{0, message, data})
}

func postRating(c *gin.Context) {
	rating := new(Rating)
	if err := c.Bind(rating); err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Bad Rating structure: %v")
	}
	if err := insertRating(rating); err != nil {
		errorReport(c, err, http.StatusInternalServerError, 1, "Failed to insert Rating: %v")
	} else {
		c.JSON(http.StatusOK, &Response{0, "Add Rating successfully", nil})
	}
}

func deleteRating(c *gin.Context) {
	id, err := strconv.Atoi(c.Query("id"))
	if err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Unknown id format: %v.")
	}
	if err := deleteRatingByID(id); err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Failed to delete Rating: %v.")
	} else {
		c.JSON(http.StatusOK, &Response{0, "Delete Rating successfully", nil})
	}
}
