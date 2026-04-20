import { setInner } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.1/element.min.js";
import { postJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.1/api.min.js";

window.onload = function () {

    function handleLogin(response) {

        setInner("status", "⏳ Memverifikasi...");

        const url = "https://sams-yd.github.io/login";

        const data = {
            token: response.credential
        };

        // PENTING:
        // Jangan kosongkan header seperti error sebelumnya
        postJSON(
            url,
            "Content-Type",
            "application/json",
            data,
            function(result){

                console.log(result);

                if(result.message === "Login Sukses!"){
                    setInner("status", "✅ Login Berhasil");
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
            theme:"outline",
            size:"large",
            shape:"pill"
        }
    );

};