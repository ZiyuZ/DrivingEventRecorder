package main

import (
	"github.com/jinzhu/gorm"
	"time"
)

type (
	Event struct {
		gorm.Model
		EventID    int       `json:"event_id"`
		OptionCode string    `json:"option_code" `
		StartTime  time.Time `json:"start_time"`
		StopTime   time.Time `json:"stop_time"`
		Desc       string    `json:"desc"`
	}

	Video struct {
		gorm.Model
		FileName         string    `json:"file_name"`
		Path             string    `json:"path"`
		BeginTime        time.Time `json:"start_time"`
		EndTime          time.Time `json:"end_time"`
		Type             string    `json:"type"` // A: outside (front); B: inside
		VideoGPSTimeDiff int       `json:"video_gps_time_diff"`
	}

	Trajectory struct {
		gorm.Model
		FileName  string    `json:"file_name"`
		Path      string    `json:"path"`
		BeginTime time.Time `json:"start_time"`
		EndTime   time.Time `json:"end_time"`
	}

	Rating struct {
		gorm.Model
		Type  int       `json:"type"`
		Time  time.Time `json:"time"`
		Grade int       `json:"grade"`
		Desc  string    `json:"desc"`
	}
)

func queryEvents() (events []Event, err error) {
	err = DB.Find(&events).Error
	return
}

func insertEvent(e *Event) (err error) {
	return DB.Create(e).Error
}

func deleteEventById(id int) (err error) {
	return DB.Where("id = ?", id).Delete(&Event{}).Error
}

func queryRatings() (ratings []Rating, err error) {
	err = DB.Find(&ratings).Error
	return
}

func insertRating(rating *Rating) (err error) {
	return DB.Create(rating).Error
}

func deleteRatingByID(id int) (err error) {
	return DB.Where("id = ?", id).Delete(&Rating{}).Error
}

func queryVideos() (videos []Video, err error) {
	err = DB.Find(&videos).Error
	return
}

func insertVideoIfNotExist(video *Video) (err error) {
	var videoFounded Video
	if DB.Where("path = ?", video.Path).First(&videoFounded).RecordNotFound() {
		return insertVideo(video)
	}
	return
}

func insertVideo(video *Video) (err error) {
	return DB.Create(video).Error
}

func queryTrajectories() (trajectories []Trajectory, err error) {
	err = DB.Find(&trajectories).Error
	return
}

func insertTrajectoryIfNotExist(trajectory *Trajectory) (err error) {
	var videoFounded Video
	if DB.Where("path = ?", trajectory.Path).Find(&videoFounded).RecordNotFound() {
		return insertTrajectory(trajectory)
	}
	return
}

func insertTrajectory(trajectory *Trajectory) (err error) {
	return DB.Create(trajectory).Error
}
