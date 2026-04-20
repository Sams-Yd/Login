package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

// Struktur untuk menerima data dari CrootJS
type LoginRequest struct {
	Token string `json:"token"`
}

func main() {
	// Menentukan endpoint API
	http.HandleFunc("/login", loginHandler)

	// Mengambil port otomatis dari sistem DOM Cloud
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Port lokal jika dijalankan di laptop
	}

	fmt.Println("Backend jalan di port: " + port)

	// Menjalankan server
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		fmt.Printf("Gagal menjalankan server: %s\n", err)
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	// PENTING: Izinkan akses dari GitHub Pages (CORS)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Menangani permintaan awal browser (Preflight)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Hanya terima metode POST
	if r.Method != http.MethodPost {
		http.Error(w, "Metode tidak diizinkan", http.StatusMethodNotAllowed)
		return
	}

	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Data tidak valid", http.StatusBadRequest)
		return
	}

	// Verifikasi Token ke Google API
	googleUrl := "https://oauth2.googleapis.com/tokeninfo?id_token=" + req.Token
	resp, err := http.Get(googleUrl)
	
	if err != nil || resp.StatusCode != 200 {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Login Gagal, Token tidak valid!",
		})
		return
	}

	// Jika token asli dan valid
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Login Sukses!",
	})
}