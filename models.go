package main

type (
	// Recorded event struct in driving behavior experiment
	Event struct {
		EventType   int    `json:"event_type"`
		EventCode   string `json:"event_code"`
		StartTime   string `json:"start_time"`
		StopTime    string `json:"stop_time"`
		Description string `json:"description"`
	}

	// Definition struct of events
	EventType struct {
		EventID     int    `json:"event_id"`
		Description string `json:"description"`
	}

	EventOption struct {
		GroupID                  int    `json:"group_id"`
		OptionID                 int    `json:"option_id"`
		GroupType                string `json:"group_type"`
		OptionContentDescription string `json:"option_content_description"`
		Description              string `json:"description"`
	}

	EventDefinition struct {
		EventType
		EventOptions []EventOption `json:"event_options"`
	}
)

func getEventDefinitions() ([]EventDefinition, error) {
	eventTypes, err := getEventType()
	if err != nil {
		return nil, err
	}
	eventOptionContent, err := getEventOptionContent()
	if err != nil {
		return nil, err
	}
	var eventDefinitions []EventDefinition
	for _, v := range eventTypes {
		eventOption, err := getEventOptionByEventID(v.EventID, eventOptionContent)
		if err != nil {
			return nil, err
		}
		e := EventDefinition{v, eventOption}
		eventDefinitions = append(eventDefinitions, e)
	}

	return eventDefinitions, nil
}

func getEventType() ([]EventType, error) {
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

func getEventOptionByEventID(eventID int, optionContent map[int]string) ([]EventOption, error) {
	eventOptionSchema := "SELECT group_id, option_id, group_type, description FROM event_option WHERE event_id = ?"
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
	var eventOptions []EventOption
	for rows.Next() {
		var o EventOption
		err := rows.Scan(&o.GroupID, &o.OptionID, &o.GroupType, &o.Description)
		if err != nil {
			return nil, err
		}
		o.OptionContentDescription = optionContent[o.OptionID]
		eventOptions = append(eventOptions, o)
	}
	return eventOptions, nil
}

func getEventOptionContent() (map[int]string, error) {
	eventOptionContentSchema := "SELECT id, description FROM event_option_content"
	rows, err := DB.Query(eventOptionContentSchema)
	if err != nil {
		return nil, err
	}
	defer func() {
		err := rows.Close()
		if err != nil {
			E.Logger.Fatal(err)
		}
	}()
	var eventOptionContents = map[int]string{}
	for rows.Next() {
		var id int
		var description string
		err := rows.Scan(&id, &description)
		if err != nil {
			return nil, err
		}
		eventOptionContents[id] = description
	}
	return eventOptionContents, nil
}
