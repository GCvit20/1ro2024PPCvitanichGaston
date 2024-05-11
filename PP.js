const formularioDatos = document.getElementById("formulario_datos");
const formularioABM = document.getElementById("formulario");

class Persona
{
    constructor(id, nombre, apellido, fechaNacimiento)
    {
        if (typeof id !== 'number' || id === null) 
        {
            console.log('El ID debe ser un número entero positivo.');
        }
        if (typeof nombre !== 'string' || nombre.trim() === '') 
        {
            console.log('El nombre no puede estar vacío.');
        }
        if (typeof apellido !== 'string' || apellido.trim() === '') 
        {
            console.log('El apellido no puede estar vacío.');
        }
        if (typeof fechaNacimiento !== 'number' || validarFormatoFecha(fechaNacimiento)) 
        {
            console.log('El formato debe ser AAAAMMDD');
        }

        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
    }

    toString() 
    {
        return `ID: ${this.id}, Nombre: ${this.nombre}, Apellido: ${this.apellido}, Fecha de nacimiento: ${this.fechaNacimiento}`;
    }
}

class Ciudadano extends Persona
{
    constructor(id, nombre, apellido, fechaNacimiento, dni)
    {
        if (typeof dni !== 'number' || dni <= 0) 
        {
            console.log('El numero de dni debe ser un número entero positivo.');
        }

        super(id, nombre, apellido, fechaNacimiento);
        this.dni = dni;
    }

    toString() 
    {
        return `${super.toString()}, DNI: ${this.dni}`;
    }
}

class Extranjero extends Persona
{
    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen)
    {
        if (typeof paisOrigen !== 'string' || paisOrigen.trim() === '') 
        {
            console.log('El pais de origen no puede ser nulo o contener numeros.');
        }

        super(id, nombre, apellido, fechaNacimiento);
        this.paisOrigen = paisOrigen;
    }

    toString() 
    {
        return `${super.toString()}, Pais de origen: ${this.paisOrigen}`;
    }

}

function validarFormatoFecha(fecha) 
{
    const regex = /^\d{8}$/;

    return regex.test(fecha);
}

function filtrarObjetosPorFiltro(personas, filtro) 
{
    return personas.filter(obj => 
    {
        if (filtro === "todos") 
        {
            return true;
        } 
        else if (filtro === "ciudadanos") 
        {
            return obj.dni !== undefined;
        } 
        else if (filtro === "extranjeros") 
        {
            return obj.paisOrigen !== undefined;
        }
    });
}

function actualizarTabla(objetosFiltrados) {
    const tbody = document.querySelector("#tablaDatos tbody");
    tbody.innerHTML = objetosFiltrados.map(obj => {
        return `
            <tr>
                <td>${obj.id || "-"}</td>
                <td>${obj.nombre || "-"}</td>
                <td>${obj.apellido || "-"}</td>
                <td>${obj.fechaNacimiento || "-"}</td>
                <td>${obj.dni || "-"}</td>
                <td>${obj.paisOrigen || "-"}</td>
            </tr>`;
    }).join('');
}

function filtrar_datos()
{
    const btnFiltrar = document.getElementById("filtro");

    btnFiltrar.addEventListener("click", function() 
    {
        const filtroSelect = document.getElementById("filtro");
        let filtro = filtroSelect.value;
        let objetosFiltrados = filtrarObjetosPorFiltro(personas, filtro);

        actualizarTabla(objetosFiltrados);
    });
}

function calcularPromedioEdad(filtro)
{
    const añoActual = new Date().getFullYear();
    
    const sumaEdades = filtro.reduce((suma, persona) => 
    {
        const year = parseInt(persona.fechaNacimiento.toString().substring(0, 4));
        
        const edad = añoActual - year;
        
        return suma + edad;
    }, 0);

    const promedioEdad = sumaEdades / filtro.length;
    
    return promedioEdad;
}

function btn_calcular_promedio()
{
    const btnCalcular = document.getElementById("btnCalcular");
    const filtroSelect = document.getElementById("filtro");

    btnCalcular.addEventListener("click", function() 
    {
        // Obtener el valor seleccionado del filtro
        const filtro = filtroSelect.value;

        // Filtrar los objetos según el filtro seleccionado
        const objetosFiltrados = filtrarObjetosPorFiltro(personas, filtro);

        // Calcular el promedio de edad de los objetos filtrados
        const promedioEdad = calcularPromedioEdad(objetosFiltrados);

        // Mostrar el promedio de edad en el input "edadPromedio"
        document.getElementById("edadPromedio").value = promedioEdad.toFixed(2);
    });
}

function selecciontabla()
{
    document.getElementById("tablaDatos").addEventListener("dblclick", (event) => 
    {
        const fila = event.target.closest("tr");
        if (!fila || fila.querySelector("th")) return;

        const esCiudadano = fila.cells[4].textContent !== "-";

        const [id, nombre, apellido, fechaNacimiento, dni, paisOrigen] = fila.cells;

        document.getElementById("id").value = id.textContent;
        document.getElementById("nombre").value = nombre.textContent;
        document.getElementById("apellido").value = apellido.textContent;
        document.getElementById("fechaNacimiento").value = fechaNacimiento.textContent;
        document.getElementById("filtro").value = esCiudadano ? "Ciudadano" : "Extranjero";

        switch (esCiudadano) 
        {
            case false:
                document.getElementById("paisOrigen").value = paisOrigen.textContent;
                document.getElementById("dni").disabled = true;
                document.getElementById("paisOrigen").disabled = false;
                document.getElementById("id").disabled = true;
                break;
            default:
                document.getElementById("dni").value = dni.textContent;
                document.getElementById("dni").disabled = false;
                document.getElementById("id").disabled = true;
                document.getElementById("paisOrigen").disabled = true;
                break;
        }

        document.getElementById("formulario_datos").style.display = "none";
        document.getElementById("formulario").style.display = "block";
        document.getElementById("btn_crear").disabled = true;
        document.getElementById("btn_eliminar").disabled = true;
        document.getElementById("tipo").disabled = true;
    });
}

function btn_agregar()
{
    const btnAgregar = document.getElementById("btn_agregar");   

    btnAgregar.addEventListener("click", function() 
    {
        const formularioDatos = document.getElementById("formulario_datos");
        const formularioABM = document.getElementById("formulario");
        
        formularioDatos.style.display = "none";
        formularioABM.style.display = "block";
        document.getElementById("id").disabled = true;
        document.getElementById("btn_modificar").disabled = true;
        document.getElementById("btn_eliminar").disabled = true;
    });
}

function seleccionTipo()
{
    const tipoSelect = document.getElementById("tipo");
    const paisOrigenInput = document.getElementById("paisOrigen");
    const dniInput = document.getElementById("dni");


    tipoSelect.addEventListener("change", function() 
    {
        
        if (this.value === "ciudadanos") 
        {
            paisOrigenInput.disabled = true;
            dniInput.disabled = false;
        } 
        else if (this.value === "extranjeros") 
        {

            paisOrigenInput.disabled = false;
            dniInput.disabled = true;
        } else {
            paisOrigenInput.disabled = false;
            dniInput.disabled = false;
        }
    });
}

function idUnico()
{
    return Date.now().toString();
}

function btn_cancelar()
{
    const btnCacnelar = document.getElementById("btn_cancelar");   

    btnCacnelar.addEventListener("click", function() 
    {       
        formularioDatos.style.display = "none";
        formularioABM.style.display = "block";
    });
}

function modificar() 
{
    const id = document.getElementById("id").value;

    // Encontrar la fila correspondiente en la tabla
    const filaSeleccionada = document.querySelector(`#tablaDatos tbody tr[data-id="${id}"]`);

    // Verificar si la fila fue encontrada
    if (filaSeleccionada) 
    {
        // Actualizar los datos en la fila
        filaSeleccionada.cells[1].textContent = document.getElementById("nombre").value;
        filaSeleccionada.cells[2].textContent = document.getElementById("apellido").value;
        filaSeleccionada.cells[3].textContent = document.getElementById("fechaNacimiento").value;

        const tipo = document.getElementById("tipo").value;
        const dni = document.getElementById("dni").value;
        const paisOrigen = document.getElementById("paisOrigen").value;

        filaSeleccionada.cells[4].textContent = tipo === "Ciudadano" ? dni : paisOrigen;
    } else {
        console.error("No se encontró la fila correspondiente en la tabla.");
    }


}

function btn_modificar()
{
    const btn_modificar = document.getElementById("btn_modificar");   

    btn_modificar.addEventListener("click", function() 
    {
        modificar();
        formularioABM.style.display = "none";    
        formularioDatos.style.display = "block";
    });
}

function alta_usuario() 
{
    const btnCrear = document.getElementById("btn_crear");

    btnCrear.addEventListener("click", function() 
    {
        const id = idUnico();
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const fechaNacimiento = document.getElementById("fechaNacimiento").value.trim();
        const dni = document.getElementById("dni").value.trim();
        const paisOrigen = parseInt(document.getElementById("paisOrigen").value.trim());

    
        if ((ventas !== "" && !isNaN(sueldo)) || (telefono !== "" && !isNaN(compras))) 
        {

            const nuevo_registro = 
            {
                id: id,
                nombre: nombre,
                apellido: apellido,
                fechaNacimiento: fechaNacimiento,
                ventas: dni !== "" ? dni : null,
                telefono: paisOrigen !== "" ? paisOrigen : null
            };

            const registro_existente = personas.find(persona => persona.id === id);

            if (registro_existente) 
            {
                alert("ERROR: Ya existe un registro con el ID ingresado. Por favor, ingrese un ID único.");
                return false;
            }

            personas.push(nuevo_registro);

            if (!isNaN(dni)) 
            {
                ciudadano.push(nuevo_registro);
            } 
            else if (typeof paisOrigen === 'string') 
            {
                extranjero.push(nuevo_registro);
            }
        } 
        else 
        {
            alert("ERROR: Un alta debe contener dni para un ciudadano, o pais de origen para un extranjero.");
            return false;
        }

        const tabla = document.getElementById("tablaDatos");
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${id}</td>
            <td>${nombre}</td>
            <td>${apellido}</td>
            <td>${fechaNacimiento}</td>
            <td>${dni || "-"}</td>
            <td>${paisOrigen || "-"}</td>
        `;
        tabla.appendChild(fila);

        actualizarTabla(objetosFiltrados);

        document.getElementById("formulario").style.display = "none";
        document.getElementById("tablaDatos").style.display = "block";
    });
}