document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("registerForm");
    const direccionInput = document.getElementById("direccionEntrega");

    // Verificación en consola
    console.log("Formulario detectado:", formulario);

    formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        alert("Botón presionado ✅"); // <- DEBE aparecer sí o sí

        const direccion = direccionInput.value.trim();

        if (direccion === "") {
            alert("⚠️ Debes ingresar una dirección");
            direccionInput.focus();
            return;
        }

        alert("✅ Dirección válida: " + direccion);

        // Redirección
        window.location.href = "../frontend13/DetalleCarrito.html";
    });

});