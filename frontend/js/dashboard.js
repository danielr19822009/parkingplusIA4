async function cargarEstadisticas() {
    try {
        const res = await fetch('/api/registros/estadisticas', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const data = await res.json();
        document.getElementById('statsDentro').textContent = data.dentro;
        document.getElementById('statsFuera').textContent = data.fuera;
    } catch (e) { console.error(e); }
}

async function cargarVehiculosActivos() {
    try {
        const res = await fetch('/api/registros/activos', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const vehiculos = await res.json();
        if (!Array.isArray(vehiculos)) {
            console.error('Error: La respuesta no es un array', vehiculos);
            return;
        }
        const grid = document.getElementById('dashboardGrid');
        grid.innerHTML = '';

        vehiculos.forEach(v => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="background: var(--primary); color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 700;">
                        ${v.placa}
                    </div>
                    <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="fas fa-thumbtack"></i> Celda: ${v.celda_numero}</span>
                </div>
                <div style="margin-top: 1rem;">
                    <p><strong>Marca:</strong> ${v.marca || 'N/A'}</p>
                    <p><strong>Color:</strong> ${v.color || 'N/A'}</p>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">
                        <i class="fas fa-clock"></i> Ingreso: ${new Date(v.fecha_ingreso).toLocaleString()}
                    </p>
                    ${v.todas_novedades ? `
                    <div style="background: rgba(var(--primary-rgb), 0.05); border: 1px dashed var(--primary); color: var(--text-main); padding: 0.75rem; border-radius: 0.5rem; margin-top: 1rem; font-size: 0.8rem;">
                        <p style="margin-bottom: 0.4rem; font-weight: 700; color: var(--primary); text-transform: uppercase; font-size: 0.65rem; letter-spacing: 0.05em;">
                            <i class="fas fa-clipboard-list"></i> Novedades Registradas
                        </p>
                        <ul style="padding-left: 1.2rem; margin: 0; line-height: 1.4;">
                            ${v.todas_novedades.split('|||').map(nov => `<li style="margin-bottom: 0.2rem;">${nov}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                </div>
                <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline" style="flex: 1; font-size: 0.8rem;" onclick="abrirModalNovedad(${v.id}, '${v.placa}')">
                        <i class="fas fa-clipboard-list"></i> Novedad
                    </button>
                    <button class="btn btn-secondary" style="flex: 1; font-size: 0.8rem;" onclick="registrarSalida(${v.id})">
                        <i class="fas fa-sign-out-alt"></i> Salida
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (e) { console.error(e); }
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function abrirModalNovedad(registroId, placa) {
    document.getElementById('novedadRegistroId').value = registroId;
    document.getElementById('novedadPlaca').textContent = 'Placa: ' + placa;
    document.getElementById('novedadInput').value = '';
    openModal('modalNovedad');
}

async function guardarNovedad() {
    const registroId = document.getElementById('novedadRegistroId').value;
    const descripcion = document.getElementById('novedadInput').value;

    if (!descripcion) return alert('Ingrese la descripción de la novedad');

    try {
        const res = await fetch('/api/novedades', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ REGISTRO_id: registroId, descripcion })
        });
        if (res.ok) {
            alert('Novedad guardada correctamente');
            closeModal('modalNovedad');
            cargarVehiculosActivos(); // Refrescar para ver la novedad en el card
        }
    } catch (e) { alert('Error al guardar novedad'); }
}

async function registrarSalida(id) {
    if (!confirm('¿Desea registrar la salida de este vehículo?')) return;
    try {
        const res = await fetch(`/api/registros/salida/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (res.ok) {
            alert('Salida registrada');
            cargarEstadisticas();
            cargarVehiculosActivos();
        }
    } catch (e) { alert('Error al registrar salida'); }
}

document.getElementById('formIngreso').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        placa: document.getElementById('ingresoPlaca').value,
        tipo: document.getElementById('ingresoTipo').value,
        marca: document.getElementById('ingresoMarca').value,
        color: document.getElementById('ingresoColor').value,
        CELDA_id: document.getElementById('ingresoCelda').value || 1
    };

    try {
        const res = await fetch('/api/registros/ingreso', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(data)
        });
        const respData = await res.json();
        if (res.ok) {
            alert('Ingreso exitoso');
            closeModal('modalIngreso');
            cargarEstadisticas();
            cargarVehiculosActivos();
            e.target.reset();
        } else {
            alert(respData.mensaje || 'Error al registrar ingreso');
        }
    } catch (e) { alert('Error al conectar con el servidor'); }
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarEstadisticas();
    cargarVehiculosActivos();
});
