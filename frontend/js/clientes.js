async function cargarClientes() {
    const lista = document.getElementById('listaClientes');
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const res = await fetch('/api/clientes', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const clientes = await res.json();
        
        if (clientes.length === 0) {
            lista.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">No hay clientes registrados.</td></tr>';
            return;
        }

        lista.innerHTML = '';
        clientes.forEach(c => {
            const tr = document.createElement('tr');
            const badgeClass = c.estado === 'Activo' ? 'badge-success' : 'badge-danger';

            tr.innerHTML = `
                <td>
                    <div style="font-weight: 700;">${c.nombre_completo}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">ID: ${c.id}</div>
                </td>
                <td>
                    <div style="font-size: 0.85rem;">${c.tipo_documento}</div>
                    <div style="font-weight: 600;">${c.num_documento}</div>
                </td>
                <td>
                    <div>${c.correo || 'N/A'}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${c.telefono || ''}</div>
                </td>
                <td style="text-align: right;">
                    <span class="badge ${badgeClass}" style="margin-right: 1rem;">${c.estado}</span>
                    <button class="btn btn-outline" style="padding: 0.4rem;" onclick="prepararEdicion(${c.id}, '${c.nombre_completo}', '${c.tipo_documento}', '${c.num_documento}', '${c.correo}', '${c.telefono}', '${c.estado}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline" style="padding: 0.4rem; color: var(--danger); border-color: var(--danger);" onclick="eliminarCliente(${c.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            lista.appendChild(tr);
        });
    } catch (e) {
        lista.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--danger); padding: 2rem;">Error al cargar datos.</td></tr>';
    }
}

function abrirModalCliente() {
    document.getElementById('modalTitle').innerText = 'Registrar Cliente';
    document.getElementById('clienteId').value = '';
    document.getElementById('formCliente').reset();
    document.getElementById('modalCliente').style.display = 'flex';
}

function cerrarModalCliente() {
    document.getElementById('modalCliente').style.display = 'none';
}

function prepararEdicion(id, nombre, tipoDoc, numDoc, correo, telefono, estado) {
    document.getElementById('modalTitle').innerText = 'Editar Cliente';
    document.getElementById('clienteId').value = id;
    document.getElementById('clienteNombre').value = nombre;
    document.getElementById('clienteTipoDoc').value = tipoDoc;
    document.getElementById('clienteNumDoc').value = numDoc;
    document.getElementById('clienteCorreo').value = correo === 'null' ? '' : correo;
    document.getElementById('clienteTelefono').value = telefono === 'null' ? '' : telefono;
    document.getElementById('clienteEstado').value = estado;
    document.getElementById('modalCliente').style.display = 'flex';
}

document.getElementById('formCliente').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('clienteId').value;
    const token = localStorage.getItem('token');
    
    const data = {
        nombre_completo: document.getElementById('clienteNombre').value,
        tipo_documento: document.getElementById('clienteTipoDoc').value,
        num_documento: document.getElementById('clienteNumDoc').value,
        correo: document.getElementById('clienteCorreo').value,
        telefono: document.getElementById('clienteTelefono').value,
        estado: document.getElementById('clienteEstado').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/clientes/${id}` : '/api/clientes';

    try {
        const res = await fetch(url, {
            method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            cerrarModalCliente();
            cargarClientes();
        } else {
            const err = await res.json();
            alert(err.mensaje || 'Error al guardar');
        }
    } catch (e) {
        alert('Error de conexión');
    }
});

async function eliminarCliente(id) {
    if (!confirm('¿Seguro que deseas eliminar este cliente?')) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/clientes/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) cargarClientes();
    } catch (e) {
        alert('Error de conexión');
    }
}

document.addEventListener('DOMContentLoaded', cargarClientes);
