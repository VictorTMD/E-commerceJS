// traemos del localstorage los productos agregados
let productosEnCarrito = localStorage.getItem('productos-en-carrito');
productosEnCarrito = JSON.parse(productosEnCarrito);

// traemos lo que vamos a trabajar y lo asignamos a variables
const contenedorCarritoVacio = document.querySelector('#carrito-vacio');
const contenedorCarritoProductos = document.querySelector('#carrito-productos');
const contenedorCarritoAcciones = document.querySelector('#carrito-acciones');
const contenedorCarritoComprado = document.querySelector('#carrito-comprado');
let botonesEliminar = document.querySelectorAll('.carrito-producto-eliminar');
const botonVaciar = document.querySelector('#carrito-acciones-vaciar');
const contenedorTotal = document.querySelector('#total');
const botonComprar = document.querySelector('#carrito-acciones-comprar');

//!cuando tengamos productos en el carrito  se ejecuta
// sino se ejecuta el else y vuelve a setear  los contenedores
function cargarProductosCarrito() {
  if (productosEnCarrito && productosEnCarrito.length > 0) {
    // les agregamos o quitamos la clase disabled
    // para que se muuestre o no
    contenedorCarritoVacio.classList.add('disabled');
    contenedorCarritoProductos.classList.remove('disabled');
    contenedorCarritoAcciones.classList.remove('disabled');
    contenedorCarritoComprado.classList.add('disabled');

    // cuando se ejecute vaciamos el div que contiene los productos
    contenedorCarritoProductos.innerHTML = '';

    // hacemos un foreach para q por cada producto tengamos
    // esta estructura
    productosEnCarrito.forEach((producto) => {
      const div = document.createElement('div');
      div.classList.add('carrito-producto');
      div.innerHTML = `
                <img class="carrito-producto-imagen" src="${
                  producto.imagen
                }" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${
                  producto.id
                }"><i class="bi bi-trash-fill"></i></button>
            `;
      // cada div que se cree que se haga un apend al div
      contenedorCarritoProductos.append(div);
    });
    // llamamos a las funciones para que se seteen
    actualizarBotonesEliminar();
    actualizarTotal();
  } else {
    //sino removemos y solo se mostrara carrito vacio
    contenedorCarritoVacio.classList.remove('disabled');
    contenedorCarritoProductos.classList.add('disabled');
    contenedorCarritoAcciones.classList.add('disabled');
    contenedorCarritoComprado.classList.add('disabled');
  }
}

cargarProductosCarrito();

//! funcion para setear los botones de eliminar
function actualizarBotonesEliminar() {
  botonesEliminar = document.querySelectorAll('.carrito-producto-eliminar');

  botonesEliminar.forEach((boton) => {
    boton.addEventListener('click', eliminarDelCarrito);
  });
}

//! con esta funcion queremos que pasen varias cosas al eliminar un producto
function eliminarDelCarrito(e) {
  Toastify({
    text: 'Producto eliminado',
    duration: 3000,
    close: true,
    gravity: 'top', // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: 'linear-gradient(to right,#f4fbff,#5b97b5)',
      borderRadius: '2rem',
      textTransform: 'uppercase',
      fontSize: '.75rem',
    },
    offset: {
      x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
      y: '1.5rem', // vertical axis - can be a number or a string indicating unity. eg: '2em'
    },
    onClick: function () {}, // Callback after click
  }).showToast();

  //   asignamos a una variable el id del elemento del currentarget al que tiene el evento
  // luego asignamos tmb el indice a una variable y si coinciden los id se elimina el producto
  const idBoton = e.currentTarget.id;
  const index = productosEnCarrito.findIndex(
    (producto) => producto.id === idBoton
  );
  // aqui indicamos que desde donde este el indice se elimine 1
  productosEnCarrito.splice(index, 1);
  //   volvemos a llamar a la funcion para setear el carrito
  cargarProductosCarrito();
  // lo eliminamos o actualizamos del localstor
  localStorage.setItem(
    'productos-en-carrito',
    JSON.stringify(productosEnCarrito)
  );
}

// !asignamos el evento de click al boton de vaciar y seteamos productos en carrito a 0
// tmb en el localstorage
botonVaciar.addEventListener('click', vaciarCarrito);
function vaciarCarrito() {
  Swal.fire({
    title: '¿Estás seguro?',
    icon: 'question',
    html: `Se van a borrar ${productosEnCarrito.reduce(
      (acc, producto) => acc + producto.cantidad,
      0
    )} productos.`,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      productosEnCarrito.length = 0;
      localStorage.setItem(
        'productos-en-carrito',
        JSON.stringify(productosEnCarrito)
      );
      cargarProductosCarrito();
    }
  });
}

//! seteamos el precio
function actualizarTotal() {
  const totalCalculado = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  total.innerText = `$${totalCalculado}`;
}

//! si le damos al boton comprar , seteamos a un array vacio y productoscarrito a 0 junto con el localstorage
botonComprar.addEventListener('click', comprarCarrito);
function comprarCarrito() {
  productosEnCarrito.length = 0;
  localStorage.setItem(
    'productos-en-carrito',
    JSON.stringify(productosEnCarrito)
  );

  // removemos todo y carrito comprado sera visible
  contenedorCarritoVacio.classList.add('disabled');
  contenedorCarritoProductos.classList.add('disabled');
  contenedorCarritoAcciones.classList.add('disabled');
  contenedorCarritoComprado.classList.remove('disabled');
}
