let productos = [];

fetch('./js/productos.json')
  .then((response) => response.json())
  .then((data) => {
    productos = data;
    cargarProductos(productos);
  });

// asignamos los valores a variables para trabajar con ellas

const contenedorProductos = document.querySelector('#contenedor-productos');
const botonesCategorias = document.querySelectorAll('.boton-categoria');
const tituloPrincipal = document.querySelector('#titulo-principal');
let botonesAgregar = document.querySelectorAll('.producto-agregar');
const numerito = document.querySelector('#numerito');

// hacemos un foreach en el array y le agregamos el evento de click
//
botonesCategorias.forEach((boton) =>
  boton.addEventListener('click', () => {
    aside.classList.remove('aside-visible');
  })
);

// !creamos la funcion principal utilizando
// un parametro para pasarle los
// productos
function cargarProductos(productosElegidos) {
  // cuando se ejecute la funcion vaciamos el contenedor productos
  contenedorProductos.innerHTML = '';

  // hacemos el foreach de los products que se hayan elegido con
  // estructura que queremos
  productosElegidos.forEach((producto) => {
    const div = document.createElement('div');
    div.classList.add('producto');
    div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

    contenedorProductos.append(div);
  });
  //  cada vez que se carguen productos se va ejecutar esta funcion de los botones
  actualizarBotonesAgregar();
}

// botonesCategoría es un array, le hacemos un foreach para que itere por el array
// cuando hagamos click queremos que pasen ciertas cosas
// primero  con el current target  asi le demos al icono dentro del botón funciona
// ya que currentTarget toma tmb el hijo y el padre de donde sale el E
// hacemos otro foreach para quitar el active de los otros botones cuando el click
// este en otro botón, luego agregamos el active

botonesCategorias.forEach((boton) => {
  boton.addEventListener('click', (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove('active'));
    e.currentTarget.classList.add('active');

    //  con este if si es true indicamos que haga todo lo de adentro
    // si el currentarget id es diferente al id 'todos' se ejecutara
    if (e.currentTarget.id != 'todos') {
      // con este find sacamos el nombre de la categoria elegida
      const productoCategoria = productos.find(
        (producto) => producto.categoria.id === e.currentTarget.id
      );
      tituloPrincipal.innerText = productoCategoria.categoria.nombre;

      // creamos un array con el filter de los productos que
      // coincidan con tal condición y se hace el cargarproductos (productosboton)
      // luego se ejecuta la función con tal parametro
      // y se apendea al div de arriba
      const productosBoton = productos.filter(
        (producto) => producto.categoria.id === e.currentTarget.id
      );
      cargarProductos(productosBoton);
    } else {
      // si salio false ya que no es diferente a todos mostrara este titulo y
      // todos los productos
      tituloPrincipal.innerText = 'Todos los productos';
      cargarProductos(productos);
    }
  });
});

// !hacemos una funcion  que cada vez que se carguen productos nuevos
// tmb queremos q se actualizen los botones 'agregar'
function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll('.producto-agregar');

  botonesAgregar.forEach((boton) => {
    boton.addEventListener('click', agregarAlCarrito);
  });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem('productos-en-carrito');

// si hay algo dentro del json.parse q estamos trayendo del local stor
// lo que va ser es que products en carrito sea igual a lo que trae el
// localstorage sino q sea un array vacio
if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
  // llamamos actualizar numerito
  actualizarNumerito();
} else {
  productosEnCarrito = [];
}

// !creams la funcion que va agregar los productos al carrito
function agregarAlCarrito(e) {
  Toastify({
    text: 'Producto agregado',
    duration: 3000,
    close: true,
    gravity: 'top', // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: 'linear-gradient(to right,#f4fbff,#5b97b5 )',
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

  const idBoton = e.currentTarget.id;
  // find nos devuelve el primer elemento q tengamos adentro
  const productoAgregado = productos.find(
    (producto) => producto.id === idBoton
  );
  // some nos devuelve true o false , si esto devuelve true  subimos
  // la cantidad de producto
  if (productosEnCarrito.some((producto) => producto.id === idBoton)) {
    // buscamos el numero de indice de un producto donde el id del pro sea igual
    // al idboton
    const index = productosEnCarrito.findIndex(
      (producto) => producto.id === idBoton
    );
    // sumamos la cantidad de cada producto
    productosEnCarrito[index].cantidad++;
  } else {
    // sino asignamos la cantida de 1 y la pusheamos a producto agregados
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }

  //  queremos que cada vez que se ejecute esta funcion se ejecute el numerito
  actualizarNumerito();

  // agregamos el valor en el localstorage con esta clave  'productos-en-carrito'
  //
  localStorage.setItem(
    'productos-en-carrito',
    JSON.stringify(productosEnCarrito)
  );
}

//!sumamos cantidad de producto al numerito esta funcion
// es muy util y la utilizamos mas de una vez
function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  // con esto se actualiza el numero
  numerito.innerText = nuevoNumerito;
}
