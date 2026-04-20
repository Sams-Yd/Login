import { setInner } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.1/element.min.js";

window.handleCredentialResponse = async (response) => {
    const statusLabel = document.getElementById("status-text");

    setInner("status-text", "⏳ Memverifikasi...");
    statusLabel.style.color = "#2196f3";

    const target_url = "https://hopeful-airport-tir.sgp.dom.my.id/login";

    try {
        const res = await fetch(target_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: response.credential
            })
        });

        const result = await res.json();

        console.log(result);

        if (result.message === "Login Sukses!") {
            setInner("status-text", "✅ Berhasil! Selamat Datang.");
            statusLabel.style.color = "#4caf50";
        } else {
            setInner("status-text", "❌ Gagal: " + result.message);
            statusLabel.style.color = "#f44336";
        }

    } catch (error) {
        console.error(error);
        setInner("status-text", "❌ Error koneksi ke server");
        statusLabel.style.color = "#f44336";
    }
};