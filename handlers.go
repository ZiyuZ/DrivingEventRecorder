package main

import (
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
