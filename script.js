document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Obtener referencias a los formularios
    const loginForm = document.querySelector('#loginModal form');
    const registerForm = document.querySelector('#registerModal form');
    const recoverForm = document.querySelector('#recoverModal form');

    // Clave para almacenar los usuarios en Local Storage
    const USERS_KEY = 'users';

    // Función para obtener todos los usuarios del Local Storage
    const getUsers = () => {
        const storedUsers = localStorage.getItem(USERS_KEY);
        // Devuelve el array de usuarios o un array vacío si no existe
        return storedUsers ? JSON.parse(storedUsers) : [];
    };

    // Función para guardar el array de usuarios en Local Storage
    const saveUsers = (users) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    };

    // Función genérica para manejar el envío de formularios de simulación
    function handleGenericSubmission(event, formName) {
        event.preventDefault(); 
        
        console.log(`Formulario de "${formName}" enviado. (Simulación)`);
        
        const modalElement = event.target.closest('.modal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
        }
        
        alert(`¡Éxito! Formulario de ${formName} procesado de forma simulada.`);
        event.target.reset();
    }

    // -----------------------------------------------------------------
    // LÓGICA DE REGISTRO: CREA Y GUARDA UN NUEVO USUARIO EN LOCAL STORAGE
    // -----------------------------------------------------------------
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Obtenemos los valores ingresados por el usuario
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validación de Contraseñas
            if (password !== confirmPassword) {
                alert('Error: Las contraseñas no coinciden.');
                return;
            }

            let users = getUsers();

            // Validación de Email (simple): verifica si el email ya existe
            if (users.some(user => user.email === email)) {
                alert('Error: Ya existe un usuario registrado con ese email.');
                return;
            }

            // Crear y guardar el nuevo usuario
            const newUser = { name, email, password };
            users.push(newUser);
            saveUsers(users); // <-- ¡Guardado en Local Storage!

            // Cierra el modal de Registro y avisa
            const modalElement = event.target.closest('#registerModal');
            if (modalElement) {
                bootstrap.Modal.getInstance(modalElement).hide();
            }
            
            alert(`¡Registro exitoso, ${name}! Ahora puedes iniciar sesión.`);
            event.target.reset();
        });
    }

    // -----------------------------------------------------------------
    // LÓGICA DE INICIAR SESIÓN: VALIDA CONTRA LOS DATOS GUARDADOS
    // -----------------------------------------------------------------
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            // Obtenemos los valores de login
            const userOrEmail = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const users = getUsers(); // Obtenemos todos los usuarios guardados

            // Buscamos un usuario que coincida: 
            // 1. Coincidencia por email O por nombre de usuario
            // 2. Y la contraseña debe coincidir
            const userFound = users.find(user => 
                (user.email === userOrEmail || user.name === userOrEmail) && user.password === password
            );

            if (userFound) {
                // Autenticación Exitosa
                localStorage.setItem('isAuthenticated', 'true'); // <-- Establece la bandera de acceso
                alert(`¡Bienvenido, ${userFound.name}! Redirigiendo al dashboard.`);
                window.location.href = 'dashboard.html'; // <-- Redirección al dashboard
            } else {
                // Autenticación Fallida
                alert('Error: Usuario, email o contraseña incorrectos.');
                localStorage.removeItem('isAuthenticated'); 
            }
        });
    }

    // -----------------------------------------------------------------
    // LÓGICA DE RECUPERACIÓN (Mantiene la Simulación)
    // -----------------------------------------------------------------

    // Formulario de Recuperar Contraseña
    if (recoverForm) {
        recoverForm.addEventListener('submit', function(event) {
            handleGenericSubmission(event, 'Recuperación de Contraseña');
        });
    }
    
    // Ejemplo de un Evento de Modal de Bootstrap
    const loginModalElement = document.getElementById('loginModal');
    if (loginModalElement) {
        loginModalElement.addEventListener('shown.bs.modal', function () {
            console.log('El modal de Iniciar Sesión se ha abierto completamente.');
        })
    }
});