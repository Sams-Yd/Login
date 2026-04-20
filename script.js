import { setInner } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.1/element.min.js";
import { postJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.1/api.min.js";

const BACKEND_URL = "https://hopeful-airport-tir.sgp.dom.my.id/login";

function startGoogleLogin() {

    function handleLogin(response) {

        setInner("status", "⏳ Memverifikasi login...");

        postJSON(
            BACKEND_URL,
            "Content-Type",
            "application/json",
            {
                token: response.credential
            },
            function(result){

                console.log(result);

                if(result.message === "Login Sukses!"){
                    setInner("status", "✅ Login Berhasil!");

                    // pindah halaman jika ingin
                    // window.location.href = "dashboard.html";

                }else{
                    setInner("status", "❌ " + result.message);
                }

            }
        );
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

    const tungguGoogle = setInterval(() => {
        if(window.google && google.accounts){
            clearInterval(tungguGoogle);
            startGoogleLogin();
        }
    }, 300);

};