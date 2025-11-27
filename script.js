// script.js

// Espera a que todo el contenido del DOM (incluyendo Bootstrap) esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // 1. Obtener las referencias a los elementos DOM de los modales
    const loginModalElement = document.getElementById('loginModal');
    const registerModalElement = document.getElementById('registerModal');
    const recoverModalElement = document.getElementById('recoverModal');

    // Verificar si los elementos existen (para evitar errores si no se encuentran)
    if (!loginModalElement || !registerModalElement || !recoverModalElement) {
        console.error("No se encontraron todos los elementos modales. Verifica los IDs en index.html.");
        return; 
    }

    // 2. Crear instancias de los objetos Modal de Bootstrap para su control
    const loginModal = new bootstrap.Modal(loginModalElement);
    const registerModal = new bootstrap.Modal(registerModalElement);
    const recoverModal = new bootstrap.Modal(recoverModalElement);

    // -----------------------------------------------------------
    // 3. Lógica para CONMUTAR (cambiar) entre modales
    // -----------------------------------------------------------

    // Función genérica para cambiar un modal (ocultar) por otro (mostrar)
    const switchModal = (modalToHide, modalToShow) => {
        modalToHide.hide();
        // Usamos un pequeño delay para que la animación de cierre del primer modal sea visible
        setTimeout(() => {
            modalToShow.show();
        }, 150); 
    };


    // A. De Login a Registro
    const registerLinkInLogin = loginModalElement.querySelector('a[data-bs-target="#registerModal"]');
    if (registerLinkInLogin) {
        registerLinkInLogin.addEventListener('click', (e) => {
            e.preventDefault();
            switchModal(loginModal, registerModal);
        });
    }

    // B. De Registro a Login
    const loginLinkInRegister = registerModalElement.querySelector('a[data-bs-target="#loginModal"]');
    if (loginLinkInRegister) {
        loginLinkInRegister.addEventListener('click', (e) => {
            e.preventDefault();
            switchModal(registerModal, loginModal);
        });
    }

    // C. De Login a Recuperar Contraseña
    const recoverLinkInLogin = loginModalElement.querySelector('a[data-bs-target="#recoverModal"]');
    if (recoverLinkInLogin) {
        recoverLinkInLogin.addEventListener('click', (e) => {
            e.preventDefault();
            switchModal(loginModal, recoverModal);
        });
    }

    // -----------------------------------------------------------
    // 4. Lógica para Simular Autenticación y Redirección
    // -----------------------------------------------------------

    // Función que maneja el envío del formulario de autenticación
    const handleAuthSubmit = (event, modal) => {
        event.preventDefault();
        
        // **NOTA IMPORTANTE:** Aquí es donde iría la lógica de validación,
        // cifrado de contraseña y guardado de datos en JSON/Local Storage (futuro).
        console.log(`Simulando proceso de autenticación/registro exitoso desde ${modal.element.id}...`);

        // Oculta el modal y redirige al dashboard (simulación de éxito)
        modal.hide();
        window.location.href = 'dashboard.html';
    };

    // Aplicar la lógica a los formularios
    const loginForm = loginModalElement.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => handleAuthSubmit(e, loginModal));
    }

    const registerForm = registerModalElement.querySelector('form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => handleAuthSubmit(e, registerModal));
    }

    // El formulario de recuperación de contraseña no requiere redirección aquí
    // simplemente se enviaría la solicitud de email (lógica de backend)
    const recoverForm = recoverModalElement.querySelector('form');
    if (recoverForm) {
        recoverForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Enlace de recuperación enviado (simulación).");
            recoverModal.hide();
        });
    }
});