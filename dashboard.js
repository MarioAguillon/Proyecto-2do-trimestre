document.addEventListener('DOMContentLoaded', () => {

    // Comprobación de autenticación
    if(localStorage.getItem('isAuthenticated') !== 'true') {
        alert("Debes iniciar sesión para acceder al dashboard.");
        window.location.href = 'index.html';
        return;
    }

    const DESTINOS_KEY = 'destinos';
    let editingId = null;

    // 1. LIBRERÍA DE IMÁGENES PREDEFINIDAS
    // Mapea el nombre del destino con el nombre del archivo en la carpeta images/
    const DESTINO_IMAGENES = {
        'PIRÁMIDES DE EGIPTO': 'images/piramide.jpg',
        'TORRE EIFFEL - PARIS': 'images/paris.jpg',
        'MACHU PICCHU - PERÚ': 'images/machu.jpg',
        'AURORA BOREAL - ALASKA': 'images/alaska.jpg',
        'SANTORINI - GRECIA': 'images/santorini.jpg',
        'PLAYA EN TAILANDIA': 'images/tailandia.jpg',
        'SAFARI EN ÁFRICA': 'images/africa.jpg',
        'VISTA NOCTURNA - TOKYO': 'images/tokyo.jpg',
        // Puedes agregar 'montañas' o 'playa' aquí si deseas más opciones
    };

    // Referencias DOM
    const destinosContainer = document.getElementById('destinos_container');
    const addEditModalElement = document.getElementById('addEditModal');
    const addEditForm = addEditModalElement.querySelector('form');
    const selectModalElement = document.getElementById('selectModal');
    const quickSelectButtonsContainer = document.getElementById('quick-select-buttons');
    const openManualModalBtn = document.getElementById('openManualModal');
    const addEditModalTitle = document.getElementById('addEditModalLabel');

    // Funciones de Local Storage
    const getDestinos = () => {
        const storedDestinos = localStorage.getItem(DESTINOS_KEY);
        return storedDestinos ? JSON.parse(storedDestinos) : [];
    };

    const saveDestinos = (destinos) => {
        localStorage.setItem(DESTINOS_KEY, JSON.stringify(destinos));
    };

    // Función para crear la tarjeta de destino (se mantiene igual)
    const createDestinoCard = (destino) => {
        const estadoClase = destino.visitado ? 'bg-success' : 'bg-warning';
        const estadoTexto = destino.visitado ? 'Visitado' : 'Pendiente';
        
        return `
            <div class="col" data-id="${destino.id}">
                <div class="card destino-card shadow-sm h-100 border-0 bg-light">
                    <img src="${destino.imagenUrl || 'images/generica.jpg'}" class="card-img-top card-img-custom" alt="Destino"> 
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold">${destino.titulo}</h5>
                        <p class="card-subtitle mb-2 text-muted small">${destino.paisCiudad}</p>
                        
                        <div class="d-flex justify-content-between align-items-center mb-2 mt-auto">
                            <span class="badge ${estadoClase}">${estadoTexto}</span>
                            <span class="fw-bold text-primary">${destino.presupuesto}</span>
                        </div>
                        
                        <p class="card-text small text-truncate" title="${destino.descripcion}">${destino.descripcion}</p>
                        
                        <div class="d-flex justify-content-end mt-2">
                            <button class="btn btn-sm btn-outline-primary me-2 edit-btn" data-id="${destino.id}">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${destino.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    // Función para renderizar el contenedor de destinos (se mantiene igual)
    const renderDestinos = () => {
        const destinos = getDestinos();
        destinosContainer.innerHTML = '';
        
        // Agregar la tarjeta de "Agregar un nuevo destino" al inicio
        const agregarCard = `
            <div class="col">
                <div class="card destino-card shadow-sm h-100 border-0 bg-light text-center p-4 d-flex align-items-center justify-content-center"
                     data-bs-toggle="modal" data-bs-target="#selectModal" style="cursor: pointer;"> 
                    <i class="bi bi-geo-alt-fill display-4 text-primary mb-2"></i>
                    <h5 class="fw-bold">Agrega un nuevo destino</h5>
                    <p class="text-muted">¡Tu próximo viaje espera ser planeado!</p>
                    <button class="btn btn-primary mt-2">+ Agregar</button>
                </div>
            </div>
        `;
        destinosContainer.insertAdjacentHTML('beforeend', agregarCard);


        destinos.forEach(destino => {
            const cardHtml = createDestinoCard(destino);
            destinosContainer.insertAdjacentHTML('beforeend', cardHtml);
        });
    };

    // Función de guardado/actualización
    const handleSaveDestino = (event) => {
        event.preventDefault();
        
        // Obtener valores del formulario
        const titulo = document.getElementById('tituloViaje').value;
        const paisCiudad = document.getElementById('paisCiudad').value;
        const descripcion = document.getElementById('descripcion').value;
        const fechaPlaneada = document.getElementById('fechaPlaneada').value;
        const presupuesto = document.getElementById('presupuesto').value;
        const visitado = document.getElementById('visitadoSwitch').checked;
        // NUEVO: Capturar la URL de la imagen, que puede haber sido precargada u oculta
        const imagenUrlInput = document.getElementById('imagenUrl').value; 

        // Define la URL de la imagen. Si hay una URL (precargada o manual), úsala. Si no, usa la genérica.
        const finalImageUrl = imagenUrlInput ? imagenUrlInput : 'images/generica.jpg';

        const nuevoDestino = {
            titulo,
            paisCiudad,
            descripcion,
            fechaPlaneada,
            presupuesto,
            visitado,
            imagenUrl: finalImageUrl // <-- Usa la imagen seleccionada o ingresada
        };

        let destinos = getDestinos();

        if (editingId) {
            // Edición: Encuentra y reemplaza el destino por su ID
            destinos = destinos.map(d => d.id === editingId ? { ...nuevoDestino, id: editingId } : d);
            editingId = null; // Resetea el modo edición
        } else {
            // Creación: Asigna un ID único y añade el destino
            nuevoDestino.id = Date.now();
            destinos.push(nuevoDestino);
        }

        saveDestinos(destinos);
        renderDestinos();
        bootstrap.Modal.getInstance(addEditModalElement).hide();
        addEditForm.reset();
    };


    // Función de edición (se mantiene igual, pero precarga el nuevo campo de imagen)
    const handleEditDestino = (id) => {
        const destinos = getDestinos();
        const destino = destinos.find(d => d.id == id);
        
        if (destino) {
            editingId = id;
            addEditModalTitle.textContent = 'Editar Destino';
            
            // Precargar el formulario con los datos del destino
            document.getElementById('tituloViaje').value = destino.titulo;
            document.getElementById('paisCiudad').value = destino.paisCiudad;
            document.getElementById('descripcion').value = destino.descripcion;
            document.getElementById('fechaPlaneada').value = destino.fechaPlaneada;
            document.getElementById('presupuesto').value = destino.presupuesto;
            document.getElementById('visitadoSwitch').checked = destino.visitado;
            // NUEVO: Precargar el campo de imagen
            document.getElementById('imagenUrl').value = destino.imagenUrl || ''; 
            
            const addEditModalInstance = new bootstrap.Modal(addEditModalElement);
            addEditModalInstance.show();
        }
    };

    // Función de eliminación (se mantiene igual)
    const handleDeleteDestino = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este destino?')) {
            let destinos = getDestinos();
            destinos = destinos.filter(d => d.id != id);
            saveDestinos(destinos);
            renderDestinos();
        }
    };

    // Event Listeners (se mantiene igual)
    destinosContainer.addEventListener('click', (e) => {
        const id = e.target.dataset.id || e.target.closest('button')?.dataset.id;
        
        if (e.target.closest('.edit-btn')) {
            handleEditDestino(id);
        } else if (e.target.closest('.delete-btn')) {
            handleDeleteDestino(id);
        }
    });

    addEditForm.addEventListener('submit', handleSaveDestino);

    // Limpiar el formulario y resetear el ID de edición al cerrar el modal
    addEditModalElement.addEventListener('hidden.bs.modal', () => {
        addEditForm.reset();
        editingId = null;
        addEditModalTitle.textContent = 'Agregar Nuevo Destino';
    });
    
    // -----------------------------------------------------------------
    // LÓGICA DEL NUEVO MODAL DE SELECCIÓN RÁPIDA
    // -----------------------------------------------------------------

    // Función para renderizar los botones de selección
    const renderQuickSelectButtons = () => {
        quickSelectButtonsContainer.innerHTML = '';
        Object.keys(DESTINO_IMAGENES).forEach(destino => {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-success', 'quick-select-btn');
            button.textContent = destino;
            button.dataset.destino = destino;
            quickSelectButtonsContainer.appendChild(button);
        });
    };

    // Manejador: Al hacer clic en un destino predefinido
    quickSelectButtonsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('.quick-select-btn');
        if (target) {
            const destinoSeleccionado = target.dataset.destino;
            const imageUrl = DESTINO_IMAGENES[destinoSeleccionado];

            // 1. Cierra el modal de selección rápida
            bootstrap.Modal.getInstance(selectModalElement).hide();

            // 2. Precarga el formulario de agregar/editar
            document.getElementById('tituloViaje').value = destinoSeleccionado;
            
            // 3. Establece la URL de la imagen en el campo oculto
            document.getElementById('imagenUrl').value = imageUrl;

            // 4. Abre el modal de edición/agregación para que el usuario complete los detalles
            const addEditModalInstance = new bootstrap.Modal(addEditModalElement);
            addEditModalInstance.show();
        }
    });
    
    // Manejador: Para abrir el modal manual desde la selección rápida
    openManualModalBtn.addEventListener('click', () => {
        bootstrap.Modal.getInstance(selectModalElement).hide();
        const addEditModalInstance = new bootstrap.Modal(addEditModalElement);
        addEditModalInstance.show();
    });

    // Inicializa los botones cuando se abre el modal de selección
    selectModalElement.addEventListener('show.bs.modal', renderQuickSelectButtons);


    // Inicialización del dashboard
    renderDestinos();
    
    // Lógica para el botón de cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isAuthenticated');
            window.location.href = 'index.html';
        });
    }

});