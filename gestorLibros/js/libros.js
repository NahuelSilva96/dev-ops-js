let libros = JSON.parse(localStorage.getItem('libros')) || []
let editando = false
let indiceEditar = null
let ordenAscendente = false

const agregarLibro = () => {
  const titulo = document.getElementById('titulo').value.trim()
  const autor = document.getElementById('autor').value.trim()
  const anio = parseInt(document.getElementById('anio').value)
  const genero = document.getElementById('genero').value
  const leido = document.getElementById('leido').checked

  const anioActual = new Date().getFullYear()
  if (!titulo || !autor || !anio || !genero || anio < 1900 || anio > anioActual) {
    alert('Datos inválidos')
    return
  }

  const duplicado = libros.some(libro =>
    libro.titulo.toLowerCase() === titulo.toLowerCase() &&
    libro.autor.toLowerCase() === autor.toLowerCase()
  )
  if (!editando && duplicado) {
    alert('Ya existe un libro con ese título y autor')
    return
  }

  const nuevoLibro = { titulo, autor, anio, genero, leido }

  if (editando) {
    libros[indiceEditar] = nuevoLibro
    editando = false
    indiceEditar = null
    document.querySelector('button[type="submit"]').innerText = 'Agregar libro'
  } else {
    libros.push(nuevoLibro)
  }

  localStorage.setItem('libros', JSON.stringify(libros))
  renderizarLibros()
  mostrarResumen()
  actualizarSelectGenero()
  document.getElementById('titulo').value = ''
  document.getElementById('autor').value = ''
  document.getElementById('anio').value = ''
  document.getElementById('genero').value = ''
  document.getElementById('leido').checked = false
}

const renderizarLibros = (lista = libros) => {
  const tabla = document.getElementById('tablaLibros').querySelector('tbody')
  tabla.innerHTML = ''
  lista.forEach((libro, i) => {
    const fila = document.createElement('tr')
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>${libro.titulo}</td>
      <td>${libro.autor}</td>
      <td>${libro.anio}</td>
      <td>${libro.genero}</td>
      <td>${libro.leido ? '✅' : '❌'}</td>
      <td>
        <button onclick="editarLibro(${i})">Editar</button>
        <button onclick="eliminarLibro(${i})">Eliminar</button>
      </td>
    `
    tabla.appendChild(fila)
  })
}

const editarLibro = index => {
  const libro = libros[index]
  document.getElementById('titulo').value = libro.titulo
  document.getElementById('autor').value = libro.autor
  document.getElementById('anio').value = libro.anio
  document.getElementById('genero').value = libro.genero
  document.getElementById('leido').checked = libro.leido
  document.querySelector('button[type="submit"]').innerText = 'Actualizar libro'
  editando = true
  indiceEditar = index
}

const eliminarLibro = index => {
  libros.splice(index, 1)
  localStorage.setItem('libros', JSON.stringify(libros))
  renderizarLibros()
  mostrarResumen()
  actualizarSelectGenero()
}

const filtrarLibrosPorTitulo = () => {
  const texto = document.getElementById('busqueda').value.toLowerCase()
  const filtrados = libros.filter(libro =>
    libro.titulo.toLowerCase().includes(texto)
  )
  renderizarLibros(filtrados)
}

const actualizarSelectGenero = () => {
  const select = document.getElementById('filtroGenero')
  const generosUnicos = [...new Set(libros.map(l => l.genero))]
  select.innerHTML = `<option value="todos">Todos</option>`
  generosUnicos.forEach(genero => {
    const option = document.createElement("option")
    option.value = genero
    option.text = genero
    select.appendChild(option)
  })
}

const filtrarPorGenero = () => {
  const genero = document.getElementById('filtroGenero').value
  const filtrados = genero === 'todos' ? libros : libros.filter(libro => libro.genero === genero)
  renderizarLibros(filtrados)
}

const filtrarPorEstadoLectura = () => {
  const estado = document.getElementById('filtroLeido').value
  let filtrados = libros
  if (estado === 'leidos') filtrados = libros.filter(libro => libro.leido)
  if (estado === 'noLeidos') filtrados = libros.filter(libro => !libro.leido)
  renderizarLibros(filtrados)
}

const ordenarPorAnio = () => {
  const ordenados = [...libros].sort((a, b) => ordenAscendente ? a.anio - b.anio : b.anio - a.anio)
  ordenAscendente = !ordenAscendente
  renderizarLibros(ordenados)
}

const mostrarResumen = () => {
  const resumen = document.getElementById('resumenLibros')
  if (libros.length === 0) {
    resumen.innerText = 'No hay libros registrados.'
    return
  }

  const total = libros.length
  const promedio = Math.round(libros.reduce((acc, l) => acc + l.anio, 0) / total)
  const posteriores2010 = libros.filter(l => l.anio > 2010).length
  const libroAntiguo = libros.reduce((a, b) => a.anio < b.anio ? a : b)
  const libroReciente = libros.reduce((a, b) => a.anio > b.anio ? a : b)
  const leidos = libros.filter(l => l.leido).length
  const noLeidos = total - leidos

    resumen.innerHTML = `
    <p>Total de libros: ${total}</p>
    <p>Promedio de año: ${promedio}</p>
    <p>Libros posteriores a 2010: ${posteriores2010}</p>
    <p>📕 Más antiguo: ${libroAntiguo.titulo} (${libroAntiguo.anio})</p>
    <p>📗 Más reciente: ${libroReciente.titulo} (${libroReciente.anio})</p>
    <p>📘 Libros leídos: ${leidos}</p>
    <p>📙 Libros no leídos: ${noLeidos}</p>
  `
}
