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
		VideoID    int       `json:"video_id"`
		Desc       string    `json:"desc"`
	}

	Video struct {
		gorm.Model
		FileName         string    `json:"file_name"`
		Path             string    `json:"path"`
		BeginTime        time.Time `json:"begin_time"`
		EndTime          time.Time `json:"end_time"`
		Type             string    `json:"type"` // A: outside (front); B: inside
		VideoGPSTimeDiff int       `json:"video_gps_time_diff"`
		// Status:
		// 0: 待处理 (主要是调整begin/end/v-g diff time和type)
		// 1: 正在录入事件信息
		// 2: 录入事件信息完毕, 等待审查
		// 3: 正在审查事件
		// 3: 审查完毕, 数据可以使用
		Status int `json:"status"`
	}

	Trajectory struct {
		gorm.Model
		FileName  string    `json:"file_name"`
		Path      string    `json:"path"`
		BeginTime time.Time `json:"begin_time"`
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

func queryEvents(from string, to string) (events []Event, err error) {
	if from == "" && to == "" {
		err = DB.Find(&events).Error
	} else if from != "" && to != "" {
		err = DB.Where("start_time > ? AND start_time < ?", from, to).Find(&events).Error
	} else if from != "" && to == "" {
		err = DB.Where("start_time > ?", from).Find(&events).Error
	} else if from == "" && to != "" {
		err = DB.Where("start_time < ?", to).Find(&events).Error
	}
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

func queryVideoByID(id int) (video Video, err error) {
	err = DB.Where("id = ?", id).First(&video).Error
	return
}

func queryVideos(from string, to string) (videos []Video, err error) {
	if from == "" && to == "" {
		err = DB.Find(&videos).Error
	} else if from != "" && to != "" {
		err = DB.Where("begin_time > ? AND begin_time < ?", from, to).Find(&videos).Error
	} else if from != "" && to == "" {
		err = DB.Where("begin_time > ?", from).Find(&videos).Error
	} else if from == "" && to != "" {
		err = DB.Where("begin_time < ?", to).Find(&videos).Error
	}
	return
}

func queryVideoDates() (dates []string) {
	var videos []Video
	DB.Select("begin_time").Find(&videos)
	temp := map[string]struct{}{}
	for _, v := range videos {
		date := v.BeginTime.Format("2006-01-02")
		if _, ok := temp[date]; !ok {
			temp[date] = struct{}{}
			dates = append(dates, date)
		}
	}
	return
}

func insertVideoIfNotExist(video *Video) (err error) {
	DB.Where("path = ?", video.Path).FirstOrCreate(&video)
	return
}

func insertVideo(video *Video) (err error) {
	return DB.Create(video).Error
}

func updateVideo(updatedVideo *Video) (err error) {
	var video Video
	if err = DB.First(&video).Error; err != nil {
		return
	}
	video.FileName = updatedVideo.FileName
	video.Path = updatedVideo.Path
	video.BeginTime = updatedVideo.BeginTime
	video.EndTime = updatedVideo.EndTime
	video.Type = updatedVideo.Type
	video.VideoGPSTimeDiff = updatedVideo.VideoGPSTimeDiff
	video.Status = updatedVideo.Status
	return DB.Save(&video).Error
}

func queryTrajectoryByID(id int) (trajectory Trajectory, err error) {
	err = DB.Where("id = ?", id).First(&trajectory).Error
	return
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

func updateTrajectory(updatedTrajectory *Trajectory) (err error) {
	var trajectory Trajectory
	if err = DB.First(&trajectory).Error; err != nil {
		return
	}
	trajectory.FileName = updatedTrajectory.FileName
	trajectory.Path = updatedTrajectory.Path
	trajectory.BeginTime = updatedTrajectory.BeginTime
	trajectory.EndTime = updatedTrajectory.EndTime
	return DB.Save(&trajectory).Error
}
