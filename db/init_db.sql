CREATE TABLE EVENT
(
  ID          INTEGER PRIMARY KEY AUTOINCREMENT,
  EVENT_TYPE  INTEGER  NOT NULL,
  EVENT_CODE  TEXT     NOT NULL,
  START_TIME  CHAR(25) NOT NULL,
  STOP_TIME   CHAR(25) NOT NULL,
  DESCRIPTION NTEXT    NOT NULL DEFAULT ''
);

CREATE TABLE EVENT_TYPE
(
  ID          INTEGER PRIMARY KEY AUTOINCREMENT,
  DESCRIPTION NTEXT NOT NULL DEFAULT ''
);

CREATE TABLE EVENT_OPTION
(
  ID       INTEGER PRIMARY KEY AUTOINCREMENT,
  EVENT_ID    INTEGER NOT NULL,
  GROUP_ID    INTEGER NOT NULL,
  GROUP_TYPE  CHAR(1) NOT NULL, -- 'r' radio; 'c' check; 't' text;
  DESCRIPTION NTEXT   NOT NULL DEFAULT ''
);

INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (1,  '变道或掉头');
INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (2,  '在交叉口通过或转向');
INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (3,  '等待');
INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (4,  '跨越虚线行驶或停车');
INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (5,  '压过或越过实线行驶');
INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (6,  '超车');
INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (7,  '鸣笛');
INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (8,  '避让');
INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (9,  '事故');
INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (10, '停车');
INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (11, '驾驶员非驾驶行为');
INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (12, '道路标志');
INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (13, '接到订单/到达上客点');
INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (14, '乘客上下车');
INSERT INTO EVENT_TYPE (ID, DESCRIPTION) VALUES (15, '乘客干扰');

INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (1, 1, 'r', '向左侧变道');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (1, 1, 'r', '向右侧变道');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (1, 1, 'r', '掉头');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (1, 2, 'c', '未打转向灯');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (1, 2, 'c', '未按照信号灯指示变道或掉头');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (1, 2, 'c', '在错误的车道变道或掉头');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (2, 1, 'r', '向左侧转向');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (2, 1, 'r', '向右侧转向');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (2, 1, 'r', '直行');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (2, 2, 'c', '未打转向灯');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (2, 2, 'c', '实际行驶方向与信号灯不符');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (2, 2, 'c', '实际行驶方向与车道不符');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (3, 1, 'c', '在左转车道等待');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (3, 1, 'c', '在右转车道等待');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (3, 1, 'c', '在直行车道等待');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (3, 2, 'r', '在交叉口等待');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (3, 2, 'r', '等待前车掉头');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (4, 1, 'r', '向左侧跨越虚线');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (4, 1, 'r', '向右侧跨越虚线');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (4, 2, 'r', '跨越白色虚线');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (4, 2, 'r', '跨越黄色虚线');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (4, 3, 'c', '在虚线上临时停车');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (5, 1, 'r', '向左侧跨越实线');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (5, 1, 'r', '向右侧跨越实线');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (5, 2, 'r', '跨越白色实线');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (5, 2, 'r', '跨越黄色实线');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (5, 2, 'r', '跨越双黄线');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (5, 2, 'r', '跨越导流线');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (6, 1, 'r', '从左侧超车');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (6, 1, 'r', '从右侧超车');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (7, 1, 'r', '短按鸣笛');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (7, 1, 'r', '长按鸣笛');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (7, 1, 'r', '多次短按鸣笛');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (7, 2, 'c', '在禁止鸣笛区域鸣笛');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (8, 1, 'r', '向左侧避让');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (8, 1, 'r', '向右侧避让');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (8, 2, 'r', '避让行人');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (8, 2, 'r', '避让非机动车');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (8, 2, 'r', '避让机动车');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (8, 3, 'c', '司机出现情绪激动或语言激动');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (8, 3, 'c', '在出入口避让');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (9, 1, 'r', '本车事故');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (9, 1, 'r', '同向同车道非本车车辆事故');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (9, 1, 'r', '同向其他车道事故');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (9, 1, 'r', '对向车道事故');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (10, 1, 'r', '合法泊位');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (10, 1, 'r', '非法泊位');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (10, 1, 'r', '路内无泊位停车');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (10, 2, 'r', '跨白实线停车');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (10, 2, 'r', '跨黄实线停车');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (10, 2, 'r', '跨双黄线停车');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (11, 1, 'r', '拨打电话');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (11, 1, 'r', '发送语音');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (11, 1, 'r', '查看信息');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (11, 1, 'r', '打字');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (11, 1, 'r', '吸烟');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (11, 1, 'r', '听音乐');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (11, 1, 'r', '听广播');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (11, 1, 'r', '其他');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (11, 2, 'c', '使用蓝牙耳机');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (12, 1, 't', '道路标识信息');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (13, 1, 'r', '接到订单');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (13, 1, 'r', '到达上车点');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (14, 1, 'r', '乘客上车');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (14, 1, 'r', '乘客下车');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (15, 1, 'r', '协助导航');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (15, 1, 'r', '提出要求');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (15, 1, 'r', '与司机冲突');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (15, 1, 'r', '夸赞司机');
INSERT INTO EVENT_OPTION (EVENT_ID, GROUP_ID, GROUP_TYPE, DESCRIPTION) VALUES (15, 1, 'r', '乘客间交流或大声拨打电话');


-- INSERT INTO EVENT (EVENT_TYPE, EVENT_CODE, START_TIME, STOP_TIME, DESCRIPTION)
-- VALUES (1, '[1, 22, 14]', '2019-02-28T00:21:44', '2019-02-28T00:26:25', '');