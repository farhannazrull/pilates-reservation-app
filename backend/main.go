package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// --- Database Models ---

type Court struct {
	ID   string `gorm:"primaryKey" json:"id"`
	Name string `json:"name"`
}

type TimeSlot struct {
	ID        string `gorm:"primaryKey" json:"id"`
	StartTime string `json:"startTime"` // Format "HH:MM"
	EndTime   string `json:"endTime"`   // Format "HH:MM"
}

type Reservation struct {
	ID         string    `gorm:"primaryKey" json:"id"`
	Date       string    `gorm:"index" json:"date"`
	TimeSlotID string    `gorm:"index" json:"timeSlotId"`
	CourtID    string    `gorm:"index" json:"courtId"`
	UserName   string    `json:"userName"`
	Email      string    `json:"email"`
	Status     string    `json:"status"`
	Reference  string    `json:"reference"`
	CreatedAt  time.Time `json:"createdAt"`
}

type ReservationRequest struct {
	Date       string `json:"date"`
	TimeSlotID string `json:"timeSlotId"`
	CourtID    string `json:"courtId"`
	UserName   string `json:"userName"`
	Email      string `json:"email"`
}

type ReservationResponse struct {
	ID        string `json:"id"`
	Status    string `json:"status"`
	Message   string `json:"message"`
	Reference string `json:"reference"`
}

var db *gorm.DB

// --- Database Initialization ---

func initDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://user:password@localhost:5432/pilates_db?sslmode=disable"
	}

	var err error
	for i := 0; i < 5; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		log.Printf("Failed to connect to database, retrying in 5s... (%d/5)", i+1)
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		log.Fatal("Could not connect to database:", err)
	}

	// Auto-migrate
	db.AutoMigrate(&Court{}, &TimeSlot{}, &Reservation{})

	// Seed data
	seedData()
}

func seedData() {
	
	
courts := []Court{
		{ID: "c1", Name: "Reformer Studio A"},
		{ID: "c2", Name: "Reformer Studio B"},
		{ID: "c3", Name: "Private Suite"},
	}
	for _, c := range courts {
		db.FirstOrCreate(&c, Court{ID: c.ID})
	}

	timeSlots := []TimeSlot{
		{ID: "t1", StartTime: "07:00", EndTime: "08:00"},
		{ID: "t2", StartTime: "08:00", EndTime: "09:00"},
		{ID: "t3", StartTime: "09:00", EndTime: "10:00"},
		{ID: "t4", StartTime: "17:00", EndTime: "18:00"},
		{ID: "t5", StartTime: "18:00", EndTime: "19:00"},
		{ID: "t6", StartTime: "19:00", EndTime: "20:00"},
	}
	for _, ts := range timeSlots {
		db.FirstOrCreate(&ts, TimeSlot{ID: ts.ID})
	}
}

// --- Handlers ---

func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, ngrok-skip-browser-warning")
		
		if r.Method == "OPTIONS" {
			return
		}

		next(w, r)
	}
}

func handleAvailability(w http.ResponseWriter, r *http.Request) {
	date := r.URL.Query().Get("date")
	if date == "" {
		http.Error(w, "Date parameter required", http.StatusBadRequest)
		return
	}

	var allCourts []Court
	var allSlots []TimeSlot
	db.Find(&allCourts)
	db.Find(&allSlots)

	var reservations []Reservation
	db.Where("date = ?", date).Find(&reservations)

	booked := []string{}
	for _, res := range reservations {
		booked = append(booked, fmt.Sprintf("%s_%s", res.CourtID, res.TimeSlotID))
	}

	resp := map[string]interface{}{
		"courts":      allCourts,
		"timeSlots":   allSlots,
		"bookedSlots": booked,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func handleReservation(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ReservationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Date == "" || req.TimeSlotID == "" || req.CourtID == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	// Transactional check and create
	err := db.Transaction(func(tx *gorm.DB) error {
		var existing Reservation
		if err := tx.Where("date = ? AND time_slot_id = ? AND court_id = ?", req.Date, req.TimeSlotID, req.CourtID).First(&existing).Error; err == nil {
			return fmt.Errorf("slot already booked")
		}

		res := Reservation{
			ID:         fmt.Sprintf("res-%d", time.Now().UnixNano()),
			Date:       req.Date,
			TimeSlotID: req.TimeSlotID,
			CourtID:    req.CourtID,
			UserName:   req.UserName,
			Email:      req.Email,
			Status:     "confirmed",
			Reference:  fmt.Sprintf("PAY-%d", time.Now().Unix()),
		}

		return tx.Create(&res).Error
	})

	if err != nil {
		if err.Error() == "slot already booked" {
			http.Error(w, err.Error(), http.StatusConflict)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	resp := ReservationResponse{
		ID:        fmt.Sprintf("res-%d", time.Now().UnixNano()),
		Status:    "confirmed",
		Message:   "Reservation successful!",
		Reference: fmt.Sprintf("PAY-%d", time.Now().Unix()),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func handleBookings(w http.ResponseWriter, r *http.Request) {
	var results []struct {
		Date     string `json:"date"`
		Time     string `json:"time"`
		Studio   string `json:"studio"`
		UserName string `json:"userName"`
	}

	db.Table("reservations").
		Select("reservations.date, CONCAT(time_slots.start_time, ' - ', time_slots.end_time) as time, courts.name as studio, reservations.user_name").
		Joins("left join time_slots on time_slots.id = reservations.time_slot_id").
		Joins("left join courts on courts.id = reservations.court_id").
		Order("reservations.date desc").
		Scan(&results)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

func main() {
	initDB()

	mux := http.NewServeMux()
	mux.HandleFunc("/api/availability", enableCORS(handleAvailability))
	mux.HandleFunc("/api/reservations", enableCORS(handleReservation))
	mux.HandleFunc("/api/bookings", enableCORS(handleBookings))
	mux.HandleFunc("/api/reset", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		db.Exec("DELETE FROM reservations")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message": "System reset successfully"}`))
	}))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Pilates Reservation Backend with PostgreSQL is Running!"))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Backend server running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}