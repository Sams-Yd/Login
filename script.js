import { setInner } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.1/element.min.js";
import { postJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.1/api.min.js";

// KUNCI UTAMA: Daftarkan fungsi ke window agar Google bisa menemukannya
window.handleCredentialResponse = (response) => {
    const statusLabel = document.getElementById("status-text");
    setInner("status-text", "⏳ Memverifikasi...");
    statusLabel.style.color = "#2196f3";

    const target_url = "https://hopeful-airport-tir.sgp.dom.my.id/login";
    const data_json = { token: response.credential };

    postJSON(target_url, "", "", data_json, (result) => {
        console.log("Hasil Backend:", result);
        if (result.message === "Login Sukses!") {
            setInner("status-text", "✅ Berhasil! Selamat Datang.");
            statusLabel.style.color = "#4caf50";
        } else {
            setInner("status-text", "❌ Gagal: " + result.message);
            statusLabel.style.color = "#f44336";
        }
    });
};