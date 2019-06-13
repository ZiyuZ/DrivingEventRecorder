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
		return
	}
	var message string
	if len(data) == 0 {
		message = "No videos."
	} else {
		message = "Read video list successfully"
	}
	c.JSON(http.StatusOK, &Response{0, message, data})
}

func getVideo(c *gin.Context) {
	id, err := strconv.Atoi(c.Query("id"))
	if err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Unknown id format: %v.")
		return
	}
	video, err := queryVideoByID(id)
	if err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Failed to query video: %v.")
	} else {
		c.JSON(http.StatusOK, &Response{0, "Find video successfully", video})
	}
}

func getTrajectoryList(c *gin.Context) {
	data, err := queryTrajectories()
	if err != nil {
		errorReport(c, err, http.StatusInternalServerError, 1, "Failed to read video list: %v.")
		return
	}
	var message string
	if len(data) == 0 {
		message = "No trajectories."
	} else {
		message = "Read trajectories list successfully"
	}
	c.JSON(http.StatusOK, &Response{0, message, data})
}

func getTrajectory(c *gin.Context) {
	id, err := strconv.Atoi(c.Query("id"))
	if err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Unknown id format: %v.")
		return
	}
	trajectory, err := queryTrajectoryByID(id)
	if err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Failed to query trajectory: %v.")
	} else {
		c.JSON(http.StatusOK, &Response{0, "Find trajectory successfully", trajectory})
	}
}

func getDataStorageFiles(c *gin.Context) {
	c.JSON(http.StatusOK, &Response{0, "Read data storage files successfully", F})
}

func getEvent(c *gin.Context) {
	data, err := queryEvents()
	if err != nil {
		errorReport(c, err, http.StatusInternalServerError, 1, "Failed to read event: %v.")
		return
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
		return
	}
	if e.StartTime.IsZero() || e.EventID == 0 {
		errorReport(c, errors.New("event type or timestamps should not be null"),
			http.StatusBadRequest, 2, "Bad event structure: %v")
		return
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
		return
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
		errorReport(c, err, http.StatusInternalServerError, 1, "Failed to read ratings: %v")
		return
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
	var rating Rating
	if err := c.Bind(&rating); err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Bad rating structure: %v")
		return
	}
	if err := insertRating(&rating); err != nil {
		errorReport(c, err, http.StatusInternalServerError, 1, "Failed to insert rating: %v")
	} else {
		c.JSON(http.StatusOK, &Response{0, "Add rating successfully", nil})
	}
}

func deleteRating(c *gin.Context) {
	id, err := strconv.Atoi(c.Query("id"))
	if err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Unknown id format: %v.")
		return
	}
	if err := deleteRatingByID(id); err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Failed to delete rating: %v.")
	} else {
		c.JSON(http.StatusOK, &Response{0, "Delete rating successfully", nil})
	}
}

func putVideo(c *gin.Context) {
	var video Video
	if err := c.Bind(&video); err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Bad video structure: %v")
		return
	}
	if err := updateVideo(&video); err != nil {
		errorReport(c, err, http.StatusInternalServerError, 1, "Failed to update video: %v")
	} else {
		c.JSON(http.StatusOK, &Response{0, "Update video successfully", nil})
	}
}

func putTrajectory(c *gin.Context) {
	var trajectory Trajectory
	if err := c.Bind(&trajectory); err != nil {
		errorReport(c, err, http.StatusBadRequest, 2, "Bad trajectory structure: %v")
		return
	}
	if err := updateTrajectory(&trajectory); err != nil {
		errorReport(c, err, http.StatusInternalServerError, 1, "Failed to update trajectory: %v")
	} else {
		c.JSON(http.StatusOK, &Response{0, "Update trajectory successfully", nil})
	}
}

func getCampusNetworkIP(c *gin.Context) {
	ip, desc := getCampusNetworkInfo()
	if ip == "" {
		writeLog("ERROR", desc)
		c.JSON(http.StatusInternalServerError, &Response{1, desc, nil})
	} else {
		c.JSON(http.StatusInternalServerError, &Response{0, desc, ip})
	}
}

func getIntranetNetworkIP(c *gin.Context) {
	ipList := getIntranetIPList()
	if len(ipList) == 0 {
		writeLog("WARN", "No valid LAN IP address")
		c.JSON(http.StatusInternalServerError, &Response{1, "No valid LAN IP address", nil})
	} else {
		c.JSON(http.StatusInternalServerError, &Response{0, "Get LAN IP successfully", ipList})
	}
}
