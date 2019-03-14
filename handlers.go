package main

import (
	"fmt"
	"github.com/labstack/echo"
	"net/http"
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func ping(c echo.Context) error {
	return c.JSON(http.StatusOK, &Response{0, "pong", nil})
}

func eventDefinition(c echo.Context) error {
	data, err := getEventDefinitions()
	if err != nil {
		message := fmt.Sprintf("Failed to read event definition: %v.", err)
		E.Logger.Warn(message)
		return c.JSON(http.StatusInternalServerError, &Response{1, message, nil})
	}
	return c.JSON(http.StatusOK, &Response{0, "Read events definition successfully", data})
}
