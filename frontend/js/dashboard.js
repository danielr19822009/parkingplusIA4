let ocupacionChart = null;

async function cargarEstadisticas() {
    try {
        const res = await fetch('/api/registros/estadisticas', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const data = await res.json();
        
        document.getElementById('statsDentro').textContent = data.dentro || 0;
        document.getElementById('statsFuera').textContent = data.fuera || 0;
        document.getElementById('statsUsuarios').textContent = data.totalUsuarios || 0;
        document.getElementById('statsClientes').textContent = data.totalClientes || 0;
        document.getElementById('statsCeldas').textContent = data.celdasDisponibles || 0;

        // Renderizar/Actualizar Gráfico
        renderizarGrafico(data.ocupacionPorDia, data.totalCeldas);
    } catch (e) { console.error(e); }
}

function renderizarGrafico(datos, totalCeldas) {
    const ctx = document.getElementById('ocupacionChart').getContext('2d');
    
    // Preparar etiquetas (fechas) y valores
    const labels = datos.map(d => {
        const date = new Date(d.fecha);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    });
    const values = datos.map(d => d.cantidad);
    const capacityData = labels.map(() => totalCeldas);

    if (ocupacionChart) {
        ocupacionChart.data.labels = labels;
        ocupacionChart.data.datasets[0].data = values;
        ocupacionChart.data.datasets[1].data = capacityData;
        ocupacionChart.update();
    } else {
        ocupacionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Ingresos Diarios',
                        data: values,
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#2563eb',
                        pointRadius: 5
                    },
                    {
                        label: 'Capacidad Total',
                        data: capacityData,
                        borderColor: '#ef4444',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        display: true, 
                        position: 'top',
                        labels: { boxWidth: 10, font: { size: 10 } }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, font: { size: 10 } },
                    },
                    x: {
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });
    }
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

    if (!descripcion) {
        return Swal.fire('Atención', 'Ingrese la descripción de la novedad', 'warning');
    }

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
            Swal.fire('Éxito', 'Novedad guardada correctamente', 'success');
            closeModal('modalNovedad');
            cargarVehiculosActivos(); 
        }
    } catch (e) { 
        Swal.fire('Error', 'Error al guardar novedad', 'error'); 
    }
}

async function registrarSalida(id) {
    const result = await Swal.fire({
        title: '¿Registrar Salida?',
        text: '¿Desea registrar la salida de este vehículo?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
        const res = await fetch(`/api/registros/salida/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (res.ok) {
            Swal.fire('Registrada', 'Salida registrada correctamente', 'success');
            cargarEstadisticas();
            cargarVehiculosActivos();
        }
    } catch (e) { 
        Swal.fire('Error', 'Error al registrar salida', 'error'); 
    }
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
            Swal.fire('¡Ingreso Exitoso!', 'El vehículo se registró correctamente.', 'success');
            closeModal('modalIngreso');
            cargarEstadisticas();
            cargarVehiculosActivos();
            e.target.reset();
        } else {
            Swal.fire('No se pudo registrar', respData.mensaje || 'Error al registrar ingreso', 'error');
        }
    } catch (e) { 
        Swal.fire('Error', 'Error al conectar con el servidor', 'error'); 
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarEstadisticas();
    cargarVehiculosActivos();
});
