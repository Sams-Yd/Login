import { setInner } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.1/element.min.js";

const BACKEND_URL = "https://hopeful-airport-tir.sgp.dom.my.id/login";

function parseJwt(token) {
    return JSON.parse(atob(token.split('.')[1]));
}

function mulaiGoogleLogin() {

    function handleLogin(response) {

        setInner("status", "⏳ Memverifikasi...");

        fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: response.credential
            })
        })
        .then(res => res.json())
        .then(result => {

            if(result.message === "Login Sukses!") {

                const user = parseJwt(response.credential);

                localStorage.setItem("login", "true");
                localStorage.setItem("name", user.name);
                localStorage.setItem("email", user.email);
                localStorage.setItem("photo", user.picture);

                setInner("status", "✅ Login Berhasil!");

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);

            } else {
                setInner("status", "❌ Login gagal");
            }

        })
        .catch(() => {
            setInner("status", "❌ Gagal koneksi server");
        });
    }

    google.accounts.id.initialize({
        client_id: "700649521479-pg9lerspa7oos4b5t2ihimf0j76g60l7.apps.googleusercontent.com",
        callback: handleLogin
    });

    google.accounts.id.renderButton(
        document.getElementById("google-btn"),
        {
            theme: "outline",
            size: "large",
            shape: "pill",
            width: 280
        }
    );
}

window.onload = function () {

    if(localStorage.getItem("login") === "true"){
        window.location.href = "dashboard.html";
    }

    const cek = setInterval(() => {
        if(window.google && google.accounts){
            clearInterval(cek);
            mulaiGoogleLogin();
        }
    }, 300);

};