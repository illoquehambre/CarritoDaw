class Carrito {
    constructor() {
        this.productos = [];
        this.total = 0;
    }

    agregarProducto(producto) {

        const productoExistente = this.productos.find(p => p.id === producto.id);

        if (productoExistente) {
            productoExistente.cantidad += producto.cantidad;  // Aumenta la cantidad si ya existe en el carrito
        } else {
            this.productos.push(producto);  // Si no existe, lo agrega
        }
        this.setTotal()
    }

    aumentarCantidad(productoId) {
        console.log('aumentar');
        console.log(productoId);
        const productoExistente = this.productos.find(p => p.id === productoId);
        console.log(productoExistente);

        if (productoExistente) {
            productoExistente.cantidad += 1;
            this.setTotal()  // Aumenta la cantidad si ya existe en el carrito
        }
    }

    disminuirCantidad(productoId) {
        console.log('disminuir');
        console.log(productoId);

        const productoExistente = this.productos.find(p => p.id === productoId);
        if (productoExistente) {
            if (productoExistente.cantidad > 1) {
                productoExistente.cantidad -= 1;  // Aumenta la cantidad si ya existe en el carrito

            } else {
                this.eliminarProducto(productoExistente.id)
            }
        }
        this.setTotal()
    }

    // Método para eliminar un producto por su ID
    eliminarProducto(idProducto) {
        this.productos = this.productos.filter(producto => producto.id !== idProducto);
        this.setTotal()
    }



    // DEBE CAMBIARSE PRO UN METODO QUE DEVUELVA LA TOTATALDIAD EL CARRITO EN JSON CON EL TOTAL
    //ESTE METODO DEBE USARSE EN carritoHTML en vez de la iteración que ya tiene
    setTotal() {
        this.total= this.productos.reduce((total, producto) => total + (Math.round(producto.cantidad*producto.precio*100)/100), 0);
    }

    // Método para vaciar el carrito
    vaciarCarrito() {
        console.log(this.productos);

        this.productos = [];
        console.log(this.productos);
        
        this.setTotal()
        console.log(this.total);
        
    }
    getItemsLocalStorage() {
        return JSON.parse(localStorage.getItem('carrito')) || []
    }

    //CAMBIAR LA CANTIDAD DE UN PRODUCTO POR 1 (SUMAR, RESTAR)
}

class Producto {
    constructor(id, nombre, precio, imagen, cantidad = 1) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen
        this.cantidad = cantidad;
    }
}


const carrito = document.querySelector('#carrito');
const listaProductos = document.querySelector('#lista-productos section');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const totalCarrito = document.querySelector('#total-carrito');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const carritoModel = new Carrito()
const productos = []

// Listeners
cargarEventListeners();

function cargarEventListeners() {
    // Dispara cuando se presiona "Agregar Carrito"
    listaProductos.addEventListener('click', agregarProducto); //#Ya no existe la lista carrito

    // Cuando se elimina un producto del carrito
    carrito.addEventListener('click', accionCarrito);

    // Al Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', vaciarCarritoInterno);


    // NUEVO: Contenido cargado
    document.addEventListener('DOMContentLoaded', async () => {

        const data = await getData()
        console.log("data:", data);
        data.products.forEach(producto => {
            productos.push(producto);
        })
        renderizarProductos()

        carritoModel.productos = carritoModel.getItemsLocalStorage()
        carritoModel.setTotal()

        carritoHTML();
    });
}


function renderizarProductos() {
    productos.forEach(producto => {
        const row = document.createElement('div');
        row.innerHTML = `
               <div class="card">
                    <img src=${producto.image} class="imagen-curso u-full-width">
                    <div class="info-card">
                        <h4 class="nombre">${producto.title}</h4>
                        <img src="img/estrellas.png">
                        <p class="precio">$2000  <span class="u-pull-right ">${producto.price}</span></p>
                        <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id=${producto.SKU}>Agregar Al Carrito</a>
                    </div>
                </div>
          `;
        listaProductos.appendChild(row);
    });
}

// Función que añade el producto al carrito
function agregarProducto(e) {
    e.preventDefault();
    // Delegation para agregar-carrito
    if (e.target.classList.contains('agregar-carrito')) {
        const producto = e.target.parentElement.parentElement;
        // Enviamos el producto seleccionado para tomar sus datos
        leerDatosProducto(producto);
    }
}

// Lee los datos del producto

function leerDatosProducto(producto) {
    const newProducto = new Producto(
        producto.querySelector('a').getAttribute('data-id'),
        producto.querySelector('h4').textContent,
        producto.querySelector('.precio span').textContent,
        producto.querySelector('img').src,

    )

    console.log(newProducto);
    console.log('NEW');

    carritoModel.agregarProducto(newProducto)

    carritoHTML();
}
/**/
// Elimina el producto del carrito en el DOM
function accionCarrito(e) {
    e.preventDefault();
    const producto = e.target.parentElement.parentElement;
    const productoId = producto.querySelector('a').getAttribute('data-id');
    if (e.target.classList.contains('borrar-producto')) {
        // e.target.parentElement.parentElement.remove();

        carritoModel.eliminarProducto(productoId);
        carritoHTML();
    } else if (e.target.classList.contains('disminuir')) {
        carritoModel.disminuirCantidad(productoId);
        carritoHTML();
    } else if (e.target.classList.contains('aumentar')) {
        carritoModel.aumentarCantidad(productoId);
        carritoHTML();
    }
}


// Muestra el producto seleccionado en el Carrito
function carritoHTML() {

    vaciarCarrito();

    carritoModel.productos.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
               <td>  
                    <img src="${producto.imagen}" width=100>
               </td>
               <td>${producto.nombre}</td>
               <td>${producto.precio}</td>
               <td> <button class="disminuir">-</button>${producto.cantidad} <button class="aumentar">+</button></td>
               <td> ${Math.round(producto.cantidad*producto.precio*100)/100} </td>
               <td>
                    <a href="#" class="borrar-producto" data-id="${producto.id}">X</a>
               </td>
          `;
        contenedorCarrito.appendChild(row);
        console.log(carritoModel.total);
        
        /*const total = document.createElement('span');
        total.textContent(carritoModel.total)*/
        totalCarrito.innerHTML = `TOTAL: ${carritoModel.total} €`
    });

    // NUEVO:
    sincronizarStorage();

}

//Model
// NUEVO: 
function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(carritoModel.productos));
}


//aqui debe llamar al model, vaciar el carrito y del storage y luego llamar al metodo de pintar
function vaciarCarrito() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
    totalCarrito.innerHTML = `TOTAL: 0 €`
}

async function vaciarCarritoInterno() {
     carritoModel.vaciarCarrito()
    carritoHTML()

}

async function getData() {
    try {
        //En caso de recibir un error de CORS se debe usar esta ruta con heroku server como proxy intermediario 
        //1º Debes entrar en el propio enlace de la peticion y habilitar temporalmente el uso gratuito del servicio en Heroku
        //const response = await fetch("https://cors-anywhere.herokuapp.com/http://jsonblob.com/api/1300458177576165376")
        const response = await fetch("https://jsonblob.com/api/1300458177576165376");
        if (!response.ok) {
            throw new Error("Error en la petición: " + response.status);
        }
        const data = await response.json();
        console.log("Datos recibidos:", data);
        return data;
    } catch (error) {
        console.error("Error en la petición:", error);
        throw new Error("Error en la petición:", error);
    }
}
