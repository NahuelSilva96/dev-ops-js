    /**
     * @jest-environment jsdom
     */
    const { agregarLibro } = require('../src/libros.js')

    beforeEach(() => {
    // Simula el HTML necesario
    document.body.innerHTML = `
        <input id="titulo" value="El Principito">
        <input id="autor" value="Antoine de Saint-Exupéry">
        <input id="anio" value="1943">
        <input id="genero" value="Ficción">
        <input type="checkbox" id="leido" checked>
        <button type="submit">Agregar libro</button>
        <table id="tablaLibros"><tbody></tbody></table>
        <div id="resumenLibros"></div>
        <select id="filtroGenero"></select>
        <input id="busqueda">
        <select id="filtroLeido"></select>
    `

    localStorage.clear()
    window.libros = []
    window.editando = false
    window.indiceEditar = null
    window.ordenAscendente = false

    // Simula funciones aux
    global.renderizarLibros = jest.fn()
    global.mostrarResumen = jest.fn()
    global.actualizarSelectGenero = jest.fn()
    })

    test('agrega un libro correctamente', () => {
    require('../src/libros.js') 

    agregarLibro()

    const librosGuardados = JSON.parse(localStorage.getItem('libros'))
    expect(librosGuardados.length).toBe(1)
    expect(librosGuardados[0]).toEqual({
        titulo: 'El Principito',
        autor: 'Antoine de Saint-Exupéry',
        anio: 1943,
        genero: 'Ficción',
        leido: true
    })
    })

    test('no agrega libro con año inválido', () => {
    document.getElementById('anio').value = '1800'
    window.alert = jest.fn()

    agregarLibro()

    expect(localStorage.getItem('libros')).toBeNull()
    expect(window.alert).toHaveBeenCalledWith('Datos inválidos')
    })

    test('evita duplicados si no está editando', () => {
    localStorage.setItem('libros', JSON.stringify([
        { titulo: 'El Principito', autor: 'Antoine de Saint-Exupéry', anio: 1943, genero: 'Ficción', leido: true }
    ]))
    window.libros = JSON.parse(localStorage.getItem('libros'))
    window.alert = jest.fn()

    agregarLibro()

    expect(window.alert).toHaveBeenCalledWith('Ya existe un libro con ese título y autor')
    })
