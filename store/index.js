
export const state = () => {
  return {
    comidasPorCategoria: [
      {
        nombreCategoria: 'Verduras A',
        totalDeDieta: 100,
        productos: [
          {
            nombre: 'Zanahoria',
            precio: 12.2,
            puntaje: 100
          },
          {
            nombre: 'Papa',
            precio: 62.2,
            puntaje: 100
          },
          {
            nombre: 'Ajo',
            precio: 62.2,
            puntaje: 100
          },
          {
            nombre: 'Zapallo',
            precio: 62.2,
            puntaje: 100
          },
          {
            nombre: 'Calabaza',
            precio: 62.2,
            puntaje: 100
          },
          {
            nombre: 'Tomate',
            precio: 62.2,
            puntaje: 100
          },
          {
            nombre: 'Lechuga',
            precio: 62.2,
            puntaje: 100
          }
        ]
      },
      {
        nombreCategoria: 'Verduras B',
        totalDeDieta: 500,
        productos: [
          {
            nombre: 'Pera',
            precio: 0.2,
            puntaje: 100
          },
          {
            nombre: 'Kiwi',
            precio: 3.2,
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
    prodP.puntaje -= prodP.puntaje * 0.6
  }
}
