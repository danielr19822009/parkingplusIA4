async function cargarReporteGral(tipo) {
    const content = document.getElementById('reportContent');
    const title = document.getElementById('reportTitle');
    const exportBtns = document.getElementById('exportButtons');
    content.innerHTML = '<p style="text-align: center; padding: 3rem;">Cargando reporte...</p>';
    exportBtns.style.display = 'none';

    try {
        const res = await fetch(`/api/reportes/${tipo}`);
        const data = await res.json();
        
        switch (tipo) {
            case 'vehiculos-resumen':
                title.innerText = 'Vehículos en Patio vs Salidos';
                generarTablaResumenVehiculos(data);
                break;
            case 'historial':
                title.innerText = 'Historial General de Movimientos (Log)';
                generarTablaHistorial(data);
                break;
            case 'usuarios':
                title.innerText = 'Usuarios y Roles del Sistema';
                generarTablaUsuarios(data);
                break;
            case 'vehiculos':
                title.innerText = 'Parque Automotor Registrado';
                generarTablaVehiculos(data);
                break;
            case 'celdas':
                title.innerText = 'Distribución de Celdas';
                generarTablaCeldas(data);
                break;
        }

        document.getElementById('exportButtons').style.display = 'flex';

    } catch (err) {
        console.error(err);
        content.innerHTML = '<p style="color: var(--danger); text-align: center; padding: 2rem;">Error al cargar datos.</p>';
    }
}

function generarTablaResumenVehiculos(data) {
    const content = document.getElementById('reportContent');
    const dentr = data.dentro || [];
    const fuer = data.fuera || [];

    content.innerHTML = `
        <h3>Activos en Patio (${dentr.length})</h3>
        <table class="report-table">
            <thead>
                <tr><th>Placa</th><th>Marca</th><th>Color</th><th>Celda</th><th>Ingreso</th><th>Acción</th></tr>
            </thead>
            <tbody>
                ${dentr.map(v => `
                    <tr><td>${v.placa}</td><td>${v.marca}</td><td>${v.color}</td><td>${v.celda_numero}</td>
                    <td>${new Date(v.fecha_ingreso).toLocaleString()}</td><td><span class="badge badge-success">DENTRO</span></td></tr>
                `).join('')}
            </tbody>
        </table>
        
        <h3 style="margin-top: 2.5rem;">Vehículos Salidos (${fuer.length})</h3>
        <table class="report-table">
            <thead>
                <tr><th>Placa</th><th>Marca</th><th>Celda</th><th>Salida</th><th>Total Pago</th><th>Usuario</th></tr>
            </thead>
            <tbody>
                ${fuer.map(v => `
                    <tr><td>${v.placa}</td><td>${v.marca}</td><td>${v.celda_numero}</td>
                    <td>${new Date(v.fecha_salida).toLocaleString()}</td><td>$${v.total_pagar || 0}</td><td>${v.usuario_nombre}</td></tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function generarTablaHistorial(data) {
    const content = document.getElementById('reportContent');
    content.innerHTML = `
        <table>
            <thead>
                <tr><th>Tipo</th><th>Placa</th><th>Celda</th><th>Fecha</th><th>Hora</th><th>Usuario</th><th>Estado Final</th></tr>
            </thead>
            <tbody>
                ${data.map(h => `
                    <tr><td><span class="badge ${h.tipo === 'Ingreso' ? 'badge-info' : 'badge-danger'}">${h.tipo}</span></td>
                    <td><strong>${h.placa}</strong></td><td>${h.celda}</td><td>${new Date(h.fecha).toLocaleDateString()}</td>
                    <td>${h.hora}</td><td>${h.usuario}</td><td>${h.estado}</td></tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function generarTablaUsuarios(data) {
    const content = document.getElementById('reportContent');
    content.innerHTML = `
        <table>
            <thead><tr><th>Nombres</th><th>Correo</th><th>Rol/Perfil</th><th>Estado</th><th>Documento</th></tr></thead>
            <tbody>
                ${data.map(u => `
                    <tr><td>${u.nombres} ${u.apellidos}</td><td>${u.correo}</td><td>${u.rol}</td>
                    <td><span class="badge ${u.estado === 'Activo' ? 'badge-success' : 'badge-danger'}">${u.estado}</span></td>
                    <td>${u.tipo_documento}: ${u.num_documento}</td></tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function generarTablaVehiculos(data) {
    const content = document.getElementById('reportContent');
    content.innerHTML = `
        <table>
            <thead><tr><th>Placa</th><th>Marca</th><th>Modelo</th><th>Color</th><th>Tipo</th></tr></thead>
            <tbody>
                ${data.map(v => `
                    <tr><td><strong>${v.placa}</strong></td><td>${v.marca}</td><td>${v.modelo}</td><td>${v.color}</td><td>${v.tipo}</td></tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function generarTablaCeldas(data) {
    const content = document.getElementById('reportContent');
    content.innerHTML = `
        <table>
            <thead><tr><th>Número</th><th>Tipo</th><th>Piso</th><th>Estado</th></tr></thead>
            <tbody>
                ${data.map(c => `
                    <tr><td><strong>#${c.numero}</strong></td><td>${c.tipo}</td><td>${c.piso}</td>
                    <td><span class="badge ${c.estado === 'disponible' ? 'badge-success' : 'badge-danger'}">${c.estado.toUpperCase()}</span></td></tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Reutilizar lógica de incidentes inicial
async function cargarIncidentes() {
    const content = document.getElementById('reportContent');
    const title = document.getElementById('reportTitle');
    const exportBtns = document.getElementById('exportButtons');
    title.innerText = 'Gestión de Incidentes e Infraestructura';
    content.innerHTML = '<p style="text-align: center; padding: 2rem;">Cargando incidentes...</p>';
    exportBtns.style.display = 'none';

    try {
        const res = await fetch('/api/reportes');
        const data = await res.json();
        
        content.innerHTML = `
            <table id="tablaReportes">
                <thead><tr><th>ID</th><th>Tipo</th><th>Descripción</th><th>Celda</th><th>Prioridad</th><th>Estado</th><th>Usuario</th></tr></thead>
                <tbody id="listaReportes">
                    ${data.map(rep => `
                        <tr><td>${rep.id}</td><td>${rep.tipo}</td><td>${rep.descripcion}</td><td>${rep.celda_numero || 'N/A'}</td>
                        <td><span class="badge badge-info">${rep.prioridad}</span></td><td>${rep.estado}</td><td>${rep.usuario_nombre}</td></tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('exportButtons').style.display = 'flex';
    } catch (err) { console.error(err); }
}

function exportarExcel() {
    const content = document.getElementById('reportContent');
    const tables = content.querySelectorAll('table');
    const wb = XLSX.utils.book_new();
    const fileName = document.getElementById('reportTitle').innerText.replace(/ /g, '_') + '.xlsx';

    tables.forEach((table, index) => {
        const ws = XLSX.utils.table_to_sheet(table);
        XLSX.utils.book_append_sheet(wb, ws, `Reporte_${index + 1}`);
    });

    XLSX.writeFile(wb, fileName);
}

function exportarPDF() {
    const element = document.getElementById('reportContent');
    const title = document.getElementById('reportTitle').innerText;
    const opt = {
        margin:       1,
        filename:     title.replace(/ /g, '_') + '.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save();
}

document.addEventListener('DOMContentLoaded', () => {
    cargarReporteGral('vehiculos-resumen');
});
