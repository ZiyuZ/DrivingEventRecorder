package main

type (
	// Recorded event struct in driving behavior experiment
	Event struct {
		ID             int    `json:"id"`
		EventID      int    `json:"event_id"`
		EventCode      string `json:"event_code"`
		StartTimestamp int    `json:"start_timestamp"`
		StopTimestamp  int    `json:"stop_timestamp"`
		Description    string `json:"description"`
	}

	// Definition struct of events
	EventType struct {
		EventID     int    `json:"event_id"`
		Description string `json:"description"`
	}

	EventOption struct {
		OptionID    int    `json:"option_id"`
		Description string `json:"description"`
	}

	EventOptionGroup struct {
		GroupID      int           `json:"group_id"`
		GroupType    string        `json:"group_type"`
		EventOptions []EventOption `json:"event_options"`
	}

	EventDefinition struct {
		EventType
		EventOptionGroups []EventOptionGroup `json:"event_option_groups"`
	}

	PassengerComfortLevel struct {
		ID           int `json:"id"`
		Timestamp    int `json:"timestamp"`
		ComfortLevel int `json:"comfort_level"`
	}
)

func queryEventDefinitions() ([]EventDefinition, error) {
	eventTypes, err := queryEventType()
	if err != nil {
		return nil, err
	}
	if err != nil {
		return nil, err
	}
	var eventDefinitions []EventDefinition
	for _, v := range eventTypes {
		eventOptionGroups, err := getEventOptionGroupsByEventID(v.EventID)
		if err != nil {
			return nil, err
		}
		e := EventDefinition{v, eventOptionGroups}
		eventDefinitions = append(eventDefinitions, e)
	}

	return eventDefinitions, nil
}

func queryEventType() ([]EventType, error) {
	eventTypeSchema := "SELECT id, description FROM event_type"
	rows, err := DB.Query(eventTypeSchema)
	if err != nil {
		return nil, err
	}
	defer func() {
		err := rows.Close()
		if err != nil {
			E.Logger.Fatal(err)
		}
	}()
	var eventTypes []EventType
	for rows.Next() {
		var e EventType
		err := rows.Scan(&e.EventID, &e.Description)
		if err != nil {
			return nil, err
		}
		eventTypes = append(eventTypes, e)
	}
	return eventTypes, nil
}

func getEventOptionGroupsByEventID(eventID int) ([]EventOptionGroup, error) {
	eventOptionSchema := "SELECT group_id, group_type, id, description FROM event_option WHERE event_id = $1"
	rows, err := DB.Query(eventOptionSchema, eventID)
	if err != nil {
		return nil, err
	}
	defer func() {
		err := rows.Close()
		if err != nil {
			E.Logger.Fatal(err)
		}
	}()
	var eventOptionGroups []EventOptionGroup
	for rows.Next() {
		// get options
		var groupId int
		var groupType string
		var optionId int
		var description string
		err := rows.Scan(&groupId, &groupType, &optionId, &description)
		if err != nil {
			return nil, err
		}
		// add event option group if not contain this event option group
		thisEventOptionGroup := EventOptionGroup{groupId, groupType, []EventOption{}}
		groupIsExist := false
		for _, v := range eventOptionGroups {
			if v.GroupID == groupId {
				groupIsExist = true
				break
			}
		}
		if !groupIsExist {
			eventOptionGroups = append(eventOptionGroups, thisEventOptionGroup)
		}
		// add event option into event groups
		for i, v := range eventOptionGroups {
			if v.GroupID == groupId {
				eventOptionGroups[i].EventOptions = append(v.EventOptions, EventOption{optionId, description})
			}
		}
	}
	return eventOptionGroups, nil
}

func queryEvent() (event []Event, err error) {
	querySchema := "SELECT id, event_id, event_code, start_timestamp, stop_timestamp, description FROM event"
	rows, err := DB.Query(querySchema)
	if err != nil {
		return nil, err
	}
	defer func() {
		err := rows.Close()
		if err != nil {
			E.Logger.Fatal(err)
		}
	}()
	for rows.Next() {
		var e Event
		err = rows.Scan(&e.ID, &e.EventID, &e.EventCode, &e.StartTimestamp, &e.StopTimestamp, &e.Description)
		if err != nil {
			return nil, err
		}
		event = append(event, e)
	}
	return
}

func insertEvent(e *Event) error {
	insertSchema := "INSERT INTO event (event_id, event_code, start_timestamp, stop_timestamp, description) VALUES ($1, $2, $3, $4, $5)"
	_, err := DB.Exec(insertSchema, e.EventID, e.EventCode, e.StartTimestamp, e.StopTimestamp, e.Description)
	return err
}

func deleteEventById(id int) error {
	deleteSchema := "DELETE FROM event WHERE id = $1"
	_, err := DB.Exec(deleteSchema, id)
	return err
}

func queryComfortLevel() (pcls []PassengerComfortLevel, err error) {
	querySchema := "SELECT id, timestamp, comfort_level FROM passenger_comfort_level"
	rows, err := DB.Query(querySchema)
	if err != nil {
		return nil, err
	}
	defer func() {
		err := rows.Close()
		if err != nil {
			E.Logger.Fatal(err)
		}
	}()
	for rows.Next() {
		var pcl PassengerComfortLevel
		err = rows.Scan(&pcl.ID, &pcl.Timestamp, &pcl.ComfortLevel)
		if err != nil {
			return nil, err
		}
		pcls = append(pcls, pcl)
	}
	return
}

func insertComfortLevel(pcl *PassengerComfortLevel) error {
	insertSchema := "INSERT INTO passenger_comfort_level (timestamp, comfort_level) VALUES ($1, $2)"
	_, err := DB.Exec(insertSchema, pcl.Timestamp, pcl.ComfortLevel)
	return err
}

func deleteComfortLevelByID(id int) error {
	deleteSchema := "DELETE FROM passenger_comfort_level WHERE id = $1"
	_, err := DB.Exec(deleteSchema, id)
	return err
}
