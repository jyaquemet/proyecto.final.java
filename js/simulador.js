// ==========================
// Proyecto Final - Ecommerce Entradas
// Autor: Joaquin Yaquemet
// ==========================

// Variables globales
let entradas = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ==========================
// FETCH JSON (DATOS REMOTOS)
// ==========================

async function cargarEntradas() {
    const response = await fetch("data/entradas.json");
    entradas = await response.json();
    mostrarEntradas();
}

// ==========================
// FUNCIONES
// ==========================

function mostrarEntradas() {
    const contenedor = document.getElementById("contenedorEntradas");
    contenedor.innerHTML = "";

    entradas.forEach(entrada => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <h3>${entrada.tipo}</h3>
            <p>$${entrada.precio}</p>
            <input type="number" min="1" value="1" id="cantidad-${entrada.id}">
            <button data-id="${entrada.id}">Agregar</button>
        `;

        contenedor.appendChild(div);
    });
}

function agregarAlCarrito(id) {
    const entrada = entradas.find(e => e.id === id);
    const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);

    if (cantidad <= 0) return;

    const existente = carrito.find(e => e.id === id);

    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push({ ...entrada, cantidad });
    }

    guardarCarrito();
    mostrarCarrito();

    Swal.fire({
        icon: "success",
        title: "Producto agregado",
        text: `${entrada.tipo} agregado al carrito`
    });
}

function mostrarCarrito() {
    const contenedor = document.getElementById("contenedorCarrito");
    const totalHTML = document.getElementById("totalCompra");

    contenedor.innerHTML = "";
    let total = 0;

    carrito.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <p>${producto.tipo} x${producto.cantidad}</p>
            <p>$${producto.precio * producto.cantidad}</p>
        `;

        contenedor.appendChild(div);

        total += producto.precio * producto.cantidad;
    });

    totalHTML.textContent = `Total: $${total}`;
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();

    Swal.fire("Carrito vaciado");
}

// 🔥 FUNCIÓN NUEVA (CLAVE PARA EL PROYECTO FINAL)
function finalizarCompra() {
    if (carrito.length === 0) {
        Swal.fire("El carrito está vacío");
        return;
    }

    let total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);

    Swal.fire({
        title: "Compra realizada",
        text: `Total pagado: $${total}`,
        icon: "success"
    });

    carrito = [];
    guardarCarrito();
    mostrarCarrito();
}

// ==========================
// EVENTOS (SIN DOMContentLoaded)
// ==========================

document.getElementById("contenedorEntradas")
    .addEventListener("click", e => {
        if (e.target.tagName === "BUTTON") {
            const id = parseInt(e.target.dataset.id);
            agregarAlCarrito(id);
        }
    });

document.getElementById("vaciarCarrito")
    .addEventListener("click", vaciarCarrito);

document.getElementById("finalizarCompra")
    .addEventListener("click", finalizarCompra);

// ==========================
// INICIO
// ==========================

cargarEntradas();
mostrarCarrito();
