package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os" // Tambahkan ini untuk membaca port dari server
)

type LoginRequest struct {
	Token string `json:"token"`
}

func main() {
	// Menangani endpoint /login
	http.HandleFunc("/login", loginHandler)

	// AMBIL PORT DARI ALWAYSDATA (Wajib!)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Ini buat kalau kamu tes di laptop sendiri
	}

	fmt.Println("Server berjalan di port " + port)
	
	// Gunakan variabel port tadi di sini
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		fmt.Printf("Gagal menjalankan server: %s\n", err)
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	// Header CORS agar GitHub Pages bisa kirim data
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Request tidak valid", http.StatusBadRequest)
		return
	}

	// Verifikasi Token ke Google API
	googleUrl := "https://oauth2.googleapis.com/tokeninfo?id_token=" + req.Token
	resp, err := http.Get(googleUrl)
	if err != nil || resp.StatusCode != 200 {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"message": "Login Gagal, Token Palsu!"})
		return
	}

	// Jika sukses
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Login Sukses!"})
}