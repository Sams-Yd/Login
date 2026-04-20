package main

import (
	"encoding/json"
	"net/http"
	"os"
)

type LoginRequest struct {
	Token string `json:"token"`
}

func main() {
	http.HandleFunc("/login", loginHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.ListenAndServe(":"+port, nil)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req LoginRequest
	json.NewDecoder(r.Body).Decode(&req)

	resp, err := http.Get(
		"https://oauth2.googleapis.com/tokeninfo?id_token=" + req.Token,
	)

	if err != nil || resp.StatusCode != 200 {
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Login gagal",
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Login Sukses!",
	})
}