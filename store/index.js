
export const state = () => {
  return {
    comidasPorCategoria: [
      {
        nombre: 'Verduras_A',
        totalDeDieta: 100,
        productos: [
          {
            nombre: 'Zanahoria',
            precio: 3,
            puntaje: 101
          },
          {
            nombre: 'Papa',
            precio: 2,
            puntaje: 100
          },
          {
            nombre: 'Pera',
            precio: 2,
            puntaje: 100
          },
          {
            nombre: 'Manzana',
            precio: 2,
            puntaje: 100
          },
          {
            nombre: 'Kiwi',
            precio: 2,
            puntaje: 100
          },
          {
            nombre: 'Papa',
            precio: 2,
            puntaje: 100
          },
          {
            nombre: 'Leche',
            precio: 2,
            puntaje: 100
          }
        ]
      }
    ]
  }
}
export const mutations = {
  intercambiarPuntos (state, { productoGanador, productoPerdedor, categoria }) {
    const categoriaAModificar = state.comidasPorCategoria.find(unaCategoria => unaCategoria.nombre === categoria.nombre)
    const prodG = categoriaAModificar.productos[productoGanador]
    const prodP = categoriaAModificar.productos[productoPerdedor]
    prodG.puntaje += prodP.puntaje * 0.5
    prodP.puntaje -= prodP.puntaje * 0.4
  }
}
