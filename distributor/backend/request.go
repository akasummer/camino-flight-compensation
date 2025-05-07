package main

type Request struct {
	ID                   string      `json:"id"`
	Flights              []Flight    `json:"flights"`
	MainPassenger        Passenger   `json:"mainPassenger"`
	FellowPassengers     []Passenger `json:"fellowPassengers"`
	DisruptionReason     Reason      `json:"disruptionReason"`
	Compensation         Reason      `json:"compensation"`
	CommunicationDetails string      `json:"communicationDetails"`
	TicketFile           File        `json:"ticketFile"`
	EvidenceFiles        []File      `json:"evidenceFiles"`
	Status               string      `json:"status"`
}

type Flight struct {
	ID               string    `json:"id"`
	DepartureAirport Airport   `json:"departureAirport"`
	ArrivalAirport   Airport   `json:"arrivalAirport"`
	TransitAirports  []Airport `json:"transitAirports"`
	DepartureDate    string    `json:"departureDate"`
	FlightNumber     string    `json:"flightNumber"`
}

type Airport struct {
	ID      string `json:"id"`
	Code    string `json:"code"`
	Name    string `json:"name"`
	City    string `json:"city"`
	Country string `json:"country"`
}

type Passenger struct {
	ID        string `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}

type Reason struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type File struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	URL  string `json:"url"`
	Type string `json:"type"`
}
