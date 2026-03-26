async function cargarUsuarios() {
    const listaUsuarios = document.getElementById('listaUsuarios');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const res = await fetch('/api/auth/usuarios', {
            headers: { 
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.mensaje || 'Error al cargar usuarios');
        }

        const usuarios = await res.json();
        
        if (usuarios.length === 0) {
            listaUsuarios.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 3rem; color: var(--text-muted);">
                        No hay usuarios registrados en el sistema.
                    </td>
                </tr>
            `;
            return;
        }

        listaUsuarios.innerHTML = '';
        usuarios.forEach(u => {
            const tr = document.createElement('tr');
            
            const badgeClass = u.estado === 'Activo' ? 'badge-success' : 'badge-danger';
            
            tr.innerHTML = `
                <td>
                    <div style="font-weight: 600;">${u.nombres} ${u.apellidos}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">ID: ${u.id}</div>
                </td>
                <td>${u.correo}</td>
                <td>
                    <span class="badge badge-info">${u.rol}</span>
                </td>
                <td>
                    <span class="badge ${badgeClass}">${u.estado || 'Activo'}</span>
                </td>
                <td style="text-align: right;">
                    <button class="btn btn-outline" style="padding: 0.4rem;" onclick="editarUsuario(${u.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline" style="padding: 0.4rem; color: var(--danger); border-color: var(--danger);" onclick="eliminarUsuario(${u.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            listaUsuarios.appendChild(tr);
        });

    } catch (error) {
        console.error('Error:', error);
        listaUsuarios.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem; color: var(--danger);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem; margin-bottom: 1rem;"></i><br>
                    ${error.message}
                </td>
            </tr>
        `;
    }
}

async function editarUsuario(id) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/auth/usuarios/${id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const u = await res.json();
        
        if (res.ok) {
            document.getElementById('editId').value = u.id;
            document.getElementById('editNombres').value = u.nombres;
            document.getElementById('editApellidos').value = u.apellidos;
            document.getElementById('editCorreo').value = u.correo;
            document.getElementById('editCelular').value = u.celular || '';
            document.getElementById('editRol').value = u.rol;
            document.getElementById('editEstado').value = u.estado || 'Activo';
            
            document.getElementById('modalEditar').style.display = 'flex';
        } else {
            alert(u.mensaje || 'Error al obtener datos');
        }
    } catch (e) {
        alert('Error de conexión');
    }
}

function closeModalEditar() {
    document.getElementById('modalEditar').style.display = 'none';
}

document.getElementById('formEditar').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const token = localStorage.getItem('token');
    
    const datos = {
        nombres: document.getElementById('editNombres').value,
        apellidos: document.getElementById('editApellidos').value,
        correo: document.getElementById('editCorreo').value,
        celular: document.getElementById('editCelular').value,
        rol: document.getElementById('editRol').value,
        estado: document.getElementById('editEstado').value
    };

    try {
        const res = await fetch(`/api/auth/usuarios/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(datos)
        });

        const data = await res.json();
        if (res.ok) {
            closeModalEditar();
            cargarUsuarios();
        } else {
            alert(data.mensaje || 'Error al actualizar');
        }
    } catch (e) {
        alert('Error de conexión');
    }
});

async function eliminarUsuario(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/auth/usuarios/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (res.ok) {
            cargarUsuarios();
        } else {
            const data = await res.json();
            alert(data.mensaje || 'Error al eliminar');
        }
    } catch (e) {
        alert('Error de conexión');
    }
}

document.addEventListener('DOMContentLoaded', cargarUsuarios);
