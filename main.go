package main

import (
	"encoding/json"
	"fmt"
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

	fmt.Println("Backend jalan di port:", port)

	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		fmt.Println("Gagal menjalankan server:", err)
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	// =========================
	// CORS
	// =========================
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	// Preflight Request
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Hanya POST
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Metode tidak diizinkan",
		})
		return
	}

	// =========================
	// Ambil Data JSON
	// =========================
	var req LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Data tidak valid",
		})
		return
	}

	if req.Token == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Token kosong",
		})
		return
	}

	// =========================
	// Verifikasi Token ke Google
	// =========================
	googleURL := "https://oauth2.googleapis.com/tokeninfo?id_token=" + req.Token

	resp, err := http.Get(googleURL)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Gagal terhubung ke Google",
		})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Login Gagal, Token tidak valid!",
		})
		return
	}

	// =========================
	// Login Berhasil
	// =========================
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Login Sukses!",
	})
}