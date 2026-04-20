function handleCredentialResponse(response) {
    const status = document.getElementById("status-text");

    status.innerHTML = "⏳ Memverifikasi...";
    status.style.color = "blue";

    fetch("https://hopeful-airport-tir.sgp.dom.my.id/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: response.credential
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.message === "Login Sukses!") {
            status.innerHTML = "✅ Login Berhasil!";
            status.style.color = "green";
        } else {
            status.innerHTML = "❌ " + data.message;
            status.style.color = "red";
        }
    })
    .catch(err => {
        console.log(err);
        status.innerHTML = "❌ Gagal koneksi server";
        status.style.color = "red";
    });
}

window.handleCredentialResponse = handleCredentialResponse;