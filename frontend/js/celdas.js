async function cargarCeldas() {
    const listaCeldas = document.getElementById('listaCeldas');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const res = await fetch('/api/celdas', {
            headers: { 
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.mensaje || 'Error al cargar celdas');
        }

        const celdas = await res.json();
        
        if (celdas.length === 0) {
            listaCeldas.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 3rem; color: var(--text-muted);">
                        No hay celdas registradas en el sistema.
                    </td>
                </tr>
            `;
            return;
        }

        listaCeldas.innerHTML = '';
        celdas.forEach(c => {
            const tr = document.createElement('tr');
            
            let badgeClass = 'badge-success';
            if (c.estado === 'ocupada') badgeClass = 'badge-danger';
            if (c.estado === 'mantenimiento') badgeClass = 'badge-info';
            
            tr.innerHTML = `
                <td>${c.id}</td>
                <td style="font-weight: 700;">${c.numero} (Piso ${c.piso})</td>
                <td style="text-transform: capitalize;">${c.tipo}</td>
                <td>
                    <span class="badge ${badgeClass}" style="text-transform: capitalize;">${c.estado}</span>
                </td>
                <td style="text-align: right;">
                    <button class="btn btn-outline" style="padding: 0.4rem;" onclick="prepararEdicion(${c.id}, '${c.numero}', '${c.tipo}', '${c.estado}', ${c.piso})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline" style="padding: 0.4rem; color: var(--danger); border-color: var(--danger);" onclick="eliminarCelda(${c.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            listaCeldas.appendChild(tr);
        });

    } catch (error) {
        console.error('Error:', error);
        listaCeldas.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem; color: var(--danger);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem; margin-bottom: 1rem;"></i><br>
                    ${error.message}
                </td>
            </tr>
        `;
    }
}

function abrirModalCelda() {
    document.getElementById('modalTitle').innerText = 'Crear Nueva Celda';
    document.getElementById('celdaId').value = '';
    document.getElementById('formCelda').reset();
    document.getElementById('modalCelda').style.display = 'flex';
}

function cerrarModalCelda() {
    document.getElementById('modalCelda').style.display = 'none';
}

function prepararEdicion(id, numero, tipo, estado, piso) {
    document.getElementById('modalTitle').innerText = 'Editar Celda ' + numero;
    document.getElementById('celdaId').value = id;
    document.getElementById('celdaNumero').value = numero;
    document.getElementById('celdaTipo').value = tipo;
    document.getElementById('celdaEstado').value = estado;
    document.getElementById('celdaPiso').value = piso;
    document.getElementById('modalCelda').style.display = 'flex';
}

document.getElementById('formCelda').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const id = document.getElementById('celdaId').value;
    
    const data = {
        numero: document.getElementById('celdaNumero').value,
        tipo: document.getElementById('celdaTipo').value,
        estado: document.getElementById('celdaEstado').value,
        piso: document.getElementById('celdaPiso').value
    };

    const url = id ? `/api/celdas/${id}` : '/api/celdas';
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        });

        const respData = await res.json();
        if (res.ok) {
            Swal.fire('¡Guardado!', 'La celda se guardó correctamente.', 'success');
            cerrarModalCelda();
            cargarCeldas();
        } else {
            Swal.fire('Error', respData.mensaje || 'Error al guardar la celda', 'error');
        }
    } catch (e) {
        Swal.fire('Error', 'Error de conexión', 'error');
    }
});

async function eliminarCelda(id) {
    const result = await Swal.fire({
        title: '¿Eliminar Celda?',
        text: '¿Estás seguro de que deseas eliminar esta celda? Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;
    
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/celdas/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (res.ok) {
            Swal.fire('Eliminada', 'La celda ha sido eliminada correctamente.', 'success');
            cargarCeldas();
        } else {
            const data = await res.json();
            Swal.fire('Error', data.mensaje || 'Error al eliminar', 'error');
        }
    } catch (e) {
        Swal.fire('Error', 'Error de conexión', 'error');
    }
}

document.addEventListener('DOMContentLoaded', cargarCeldas);
