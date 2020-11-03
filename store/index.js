
export const state = () => {
  return {
    comidasPorCategoria: [
      {
        nombre: 'Verduras A',
        totalDeDieta: 100,
        productos: [
          {
            nombre: 'Zanahoria',
            precio: 12.2,
            puntaje: 101
          },
          {
            nombre: 'Papa',
            precio: 3.2,
            puntaje: 100
          },
          {
            nombre: 'Ajo',
            precio: 4.2,
            puntaje: 100
          },
          {
            nombre: 'Zapallo',
            precio: 5.2,
            puntaje: 100
          },
          {
            nombre: 'Calabaza',
            precio: 6.2,
            puntaje: 100
          },
          {
            nombre: 'Tomate',
            precio: 7.2,
            puntaje: 100
          },
          {
            nombre: 'Lechuga',
            precio: 8.2,
            puntaje: 100
          }
        ]
      },
      {
        nombre: 'Verduras B',
        totalDeDieta: 500,
        productos: [
          {
            nombre: 'Pera',
            precio: 0.2,
            puntaje: 101
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
