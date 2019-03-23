# Driving Event Recorder (Frontend)

文档尚处于完善中✍...



## 已知 Bug

* 视频事件模块中, 调整进度条后需要播放视频至多1秒事件记录时间才能更新. (原因react-player的onProgress回调不会在调整进度条后立即触发)