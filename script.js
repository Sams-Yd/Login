import { setInner } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.1/element.min.js";

const BACKEND_URL = "https://hopeful-airport-tir.sgp.dom.my.id/login";

function startGoogleLogin() {

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

            console.log(result);

            if(result.message === "Login Sukses!"){
                setInner("status", "✅ Login Berhasil!");
            }else{
                setInner("status", "❌ " + result.message);
            }

        })
        .catch(error => {
            console.error(error);
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

    const tunggu = setInterval(() => {
        if(window.google && google.accounts){
            clearInterval(tunggu);
            startGoogleLogin();
        }
    }, 300);

};